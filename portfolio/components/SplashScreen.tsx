'use client';
import { useEffect, useState } from 'react';
export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter'|'hold'|'exit'>('enter');
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('exit'), 2600);
    const t3 = setTimeout(() => onComplete(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', opacity:phase==='exit'?0:1, transition:phase==='exit'?'opacity 0.8s ease':'none' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%,rgba(120,30,180,0.18) 0%,transparent 70%)', opacity:phase==='enter'?0:1, transition:'opacity 1.2s ease', pointerEvents:'none' }} />
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24, textAlign:'center', padding:'0 clamp(20px,5vw,40px)', opacity:phase==='enter'?0:1, transform:phase==='enter'?'scale(0.94) translateY(8px)':phase==='exit'?'scale(1.04)':'none', transition:'opacity 0.9s cubic-bezier(0.16,1,0.3,1),transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ width:50, height:50, borderRadius:'50%', background:'linear-gradient(135deg,#e040fb,#7b1fa2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:'#fff', boxShadow:'0 0 30px rgba(156,39,176,0.5)' }}>NS</div>
        <div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(28px,6vw,68px)', letterSpacing:'.02em', color:'#fff', textTransform:'uppercase', lineHeight:1 }}>Welcome to My</h1>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(28px,6vw,68px)', letterSpacing:'.02em', lineHeight:1, textTransform:'uppercase', background:'linear-gradient(90deg,#e040fb,#9c27b0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Design World</h1>
        </div>
        <div style={{ width:'min(200px,60vw)', height:1, background:'rgba(255,255,255,0.06)', borderRadius:1, overflow:'hidden' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#e040fb,#9c27b0)', width:phase==='enter'?'0%':phase==='exit'?'100%':'70%', transition:phase==='hold'?'width 1.6s cubic-bezier(0.16,1,0.3,1)':phase==='exit'?'width 0.4s ease':'none' }} />
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.5vw,12px)', fontWeight:300, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', opacity:phase==='hold'?1:0, transition:'opacity 0.7s 0.2s ease' }}>Nirbhava Sawant · Portfolio</p>
      </div>
    </div>
  );
}
