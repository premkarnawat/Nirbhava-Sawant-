'use client';
import { useEffect, useState } from 'react';
import { getHero } from '@/lib/data';
import { useParallax } from '@/hooks/useReveal';

const FALLBACK = { greeting:"HI, I'M", name:'NIRBHAVA SAWANT', tagline:'A 3D designer passionate about crafting bold and memorable projects ✦', cta_label:'Contact Me', profile_image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85' };

export default function HeroSection() {
  const [data, setData] = useState(FALLBACK);
  const [loaded, setLoaded] = useState(false);
  const parallaxY = useParallax(0.18);

  useEffect(() => {
    getHero().then(d => {
      if (d) setData({ ...FALLBACK, ...d, profile_image: d.profile_image || FALLBACK.profile_image });
    }).finally(() => setTimeout(() => setLoaded(true), 100));
  }, []);

  const words = data.name.split(' ');

  return (
    <section id="hero" style={{ position:'relative', minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-10%', right:'-4%', width:'55%', height:'75%', background:'radial-gradient(ellipse,rgba(110,30,175,0.14) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:'-4%', width:'40%', height:'50%', background:'radial-gradient(ellipse,rgba(70,15,130,0.09) 0%,transparent 70%)', pointerEvents:'none' }} />

      {/* Profile image - right side */}
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'clamp(40%,50%,55%)', overflow:'hidden', opacity:loaded?1:0, transition:'opacity 1.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ position:'absolute', inset:'-8%', transform:`translateY(${parallaxY}px)`, willChange:'transform' }}>
          <img src={data.profile_image} alt={data.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', filter:'brightness(0.52) saturate(0.8)' }} />
        </div>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,#000 0%,rgba(0,0,0,0.75) 30%,rgba(0,0,0,0.2) 60%,transparent 100%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,0.4) 0%,transparent 20%,transparent 75%,rgba(0,0,0,0.6) 100%)', pointerEvents:'none' }} />
      </div>

      {/* Content */}
      <div style={{ position:'relative', zIndex:5, width:'100%', maxWidth:1400, margin:'0 auto', padding:'clamp(80px,10vw,120px) clamp(20px,5vw,44px) 60px' }}>
        <div style={{ maxWidth:'clamp(280px,55%,660px)' }}>
          {/* Status badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:'clamp(16px,3vw,28px)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:50, padding:'6px 14px', opacity:loaded?1:0, transform:loaded?'none':'translateY(12px)', transition:'opacity 0.8s 0.1s cubic-bezier(0.16,1,0.3,1),transform 0.8s 0.1s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', animation:'dpulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Available for work</span>
          </div>

          {/* Title */}
          <h1 className="ht" style={{ fontSize:'clamp(48px,10vw,210px)', opacity:loaded?1:0, transform:loaded?'none':'translateY(22px)', transition:'opacity 0.9s 0.22s cubic-bezier(0.16,1,0.3,1),transform 0.9s 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
            {data.greeting}<br />
            {words.map((w,i) => <span key={i} style={{ display:'block' }}>{w}</span>)}
          </h1>

          {/* Tagline */}
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(12px,1.5vw,14px)', fontWeight:300, lineHeight:1.78, color:'rgba(255,255,255,0.42)', maxWidth:280, marginTop:'clamp(16px,3vw,24px)', marginBottom:'clamp(20px,4vw,34px)', letterSpacing:'0.01em', opacity:loaded?1:0, transform:loaded?'none':'translateY(16px)', transition:'opacity 0.9s 0.36s cubic-bezier(0.16,1,0.3,1),transform 0.9s 0.36s cubic-bezier(0.16,1,0.3,1)' }}>
            {data.tagline}
          </p>

          {/* CTA buttons */}
          <div style={{ display:'flex', gap:'clamp(10px,2vw,16px)', alignItems:'center', flexWrap:'wrap', opacity:loaded?1:0, transform:loaded?'none':'translateY(16px)', transition:'opacity 0.9s 0.5s cubic-bezier(0.16,1,0.3,1),transform 0.9s 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
            <a href="#contact"><button className="cbtn">{data.cta_label} →</button></a>
            <a href="#projects" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.38)', borderBottom:'1px solid rgba(255,255,255,0.14)', paddingBottom:2, textDecoration:'none' }}>View Work ↓</a>
          </div>
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:100, background:'linear-gradient(to bottom,transparent,rgba(0,0,0,0.6))', pointerEvents:'none' }} />

      {/* Mobile: fade image more */}
      <style>{`@media(max-width:640px){section#hero>div:nth-child(3){opacity:0.25!important}}`}</style>
    </section>
  );
}
