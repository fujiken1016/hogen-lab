"use client";

import { useEffect, useState } from "react";

const COLORS = ["#C73E3A", "#234A6B", "#E8A33D", "#7A8F4E", "#E38BA8", "#4E8FA3"];

type Piece = { left: number; delay: number; duration: number; color: string; rotate: number };

// 結果画面用の紙吹雪（クリック後にしか描画されないのでSSR不一致の心配なし）
export default function Confetti({ count = 24 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.8,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    );
    const t = setTimeout(() => setPieces([]), 4500);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}
