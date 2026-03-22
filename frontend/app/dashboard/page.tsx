"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { urlAPI } from "@/lib/api";
import { Copy, Check, ExternalLink, BarChart3, Trash2 } from "lucide-react";
import Link from "next/link";

interface LinkCard {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

const Dashboard = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkCard[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await urlAPI.getUserUrls();

        const formatted = data.map((item: any) => ({
          id: item.id,
          originalUrl: item.targetURL,
          shortUrl: `localhost:5000/${item.shortCode}`,
          clicks: item.visits || 0,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
        }));

        setLinks(formatted);
      } catch (err) {
        console.error("Failed to fetch links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // ✅ ANIMATION
  useEffect(() => {
    if (!cardsRef.current || links.length === 0) return;

    const cards = cardsRef.current.querySelectorAll(".link-card");

    gsap.fromTo(
      cards,
      { y: 24, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3,
      }
    );
  }, [links]);

  // ✅ COPY
  const handleCopy = useCallback((id: string, shortUrl: string) => {
    navigator.clipboard.writeText(`http://${shortUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    try {
      await urlAPI.deleteUrl(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Your Links
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {links.length} links
            </p>
          </div>

        
            <Link href="/">
              <button className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg">
                + New Link
              </button>
            </Link>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : (
          <div ref={cardsRef} className="flex flex-col gap-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="link-card group p-5 rounded-xl bg-card border border-border card-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        http://{link.shortUrl}
                      </span>

                      <a
                        href={`http://${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {link.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BarChart3 className="w-3.5 h-3.5" />
                      {link.clicks}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {link.createdAt}
                    </span>

                    <button
                      onClick={() => handleCopy(link.id, link.shortUrl)}
                      className="p-2 border rounded-lg"
                    >
                      {copiedId === link.id ? <Check /> : <Copy />}
                    </button>

                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 border rounded-lg"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;