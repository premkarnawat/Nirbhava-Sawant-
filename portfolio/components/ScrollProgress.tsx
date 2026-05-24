'use client';
import { useEffect, useState } from 'react';
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return <div style={{ position:'fixed', top:0, left:0, height:2, width:`${pct}%`, background:'linear-gradient(90deg,#e040fb,#9c27b0)', zIndex:9998, transition:'width 0.1s linear', pointerEvents:'none', boxShadow:'0 0 8px rgba(224,64,251,0.5)' }} />;
}
