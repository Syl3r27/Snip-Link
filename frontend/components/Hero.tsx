"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import FloatingBlobs from "@/components/FloatingBlobs";
import api from "@/lib/api";
import { Link2, ArrowRight, Check, Loader2 } from "lucide-react";

const Hero = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo(".hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.2")
      .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      .fromTo(".hero-input-wrap", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.2");
  }, []);

  // ✅ REAL BACKEND CALL
  const handleShorten = useCallback(async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setShortenedUrl("");

    try {
      const res = await api.post("/shorten", { url });

      const short =
        res.data.shortUrl ||
        res.data.data?.shortUrl ||
        `http://localhost:5000/${res.data.shortCode}`;

      setShortenedUrl(short);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    requestAnimationFrame(() => {
      if (resultRef.current) {
        gsap.fromTo(
          resultRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 }
        );
      }
    });
  }, [url]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shortenedUrl]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingBlobs />

      <main
        ref={heroRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      >
        <div className="hero-badge mb-6 px-4 py-1.5 rounded-full border text-sm">
          Fast, beautiful link shortening
        </div>

        <h1 className="hero-title text-center font-bold text-5xl md:text-7xl">
          Shorten links,
          <span className="gradient-text block"> amplify reach.</span>
        </h1>

        <p className="hero-subtitle mt-6 text-center text-muted-foreground max-w-xl">
          Transform long URLs into clean, trackable links in one click.
        </p>

        <div className="hero-input-wrap mt-10 w-full max-w-xl">
          <div className="flex gap-2 p-2 border rounded-xl">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your URL..."
              className="flex-1 p-3 outline-none"
            />

            <button
              onClick={handleShorten}
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Shorten"}
            </button>
          </div>

          {shortenedUrl && (
            <div ref={resultRef} className="mt-4 p-4 border rounded-xl flex justify-between">
              <span>{shortenedUrl}</span>

              <button onClick={handleCopy}>
                {copied ? <Check /> : "Copy"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Hero;