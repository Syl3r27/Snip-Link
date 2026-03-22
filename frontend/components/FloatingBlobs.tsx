"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface FloatingBlobsProps {
  count?: number;
}

const FloatingBlobs = ({ count = 5 }: FloatingBlobsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blobs, setBlobs] = useState<any[]>([]);

  // ✅ Generate blobs ONLY on client
  useEffect(() => {
    const colors = [
      "hsl(252 56% 62% / 0.12)",
      "hsl(204 70% 72% / 0.14)",
      "hsl(340 60% 82% / 0.12)",
      "hsl(252 56% 62% / 0.08)",
      "hsl(204 70% 88% / 0.16)",
    ];

    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      size: 180 + Math.random() * 280,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    setBlobs(generated);
  }, [count]);

  // ✅ Animation
  useEffect(() => {
    if (!containerRef.current) return;

    const els = containerRef.current.querySelectorAll(".blob");

    els.forEach((el, i) => {
      gsap.to(el, {
        x: `random(-60, 60)`,
        y: `random(-40, 40)`,
        rotation: `random(-8, 8)`,
        duration: 6 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4,
      });
    });
  }, [blobs]);

  // ✅ Prevent SSR mismatch
  if (blobs.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {blobs.map((b) => (
        <div
          key={b.id}
          className="blob absolute rounded-full blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: b.color,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBlobs;