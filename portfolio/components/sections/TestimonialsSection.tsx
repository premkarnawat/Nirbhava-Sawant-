'use client';
import { useEffect, useState } from 'react';
import { getTestimonials } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const FB = [
  { id:'t1', name:'Arjun Mehta', role:'CEO', company:'Nexus Digital', rating:5, content:'Nirbhava transformed our entire brand identity. The 3D assets and motion system she delivered were beyond what we imagined. Incredibly talented and professional.' },
  { id:'t2', name:'Priya Sharma', role:'Product Lead', company:'PixForge', rating:5, content:"Working with Nirbhava was a game-changer for our product. The UX overhaul resulted in 58% better conversions. Her process is thorough and her designs are stunning." },
  { id:'t3', name:'Lucas Fernandez', role:'Creative Director', company:'MetaMorph', rating:5, content:"The motion brand identity Nirbhava created for us is extraordinary. We've collaborated on three projects now and every one exceeded expectations." },
];

const Stars = ({ n }: { n: number }) => (
  <div style={{ display:'flex', gap:3, justifyContent:'center' }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<=n?'#fbbf24':'rgba(0,0,0,0.15)'}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
    ))}
  </div>
);

export default function TestimonialsSection() {
  const [items, setItems] = useState<any[]>(FB);
  const [active, setActive] = useState(0);
  const header  = useReveal(0.1);
  const content = useReveal(0.1);

  useEffect(() => { getTestimonials().then(d => { if (d?.length) setItems(d); }); }, []);

  const cur = items[Math.min(active, items.length - 1)] || items[0];

  return (
    <section id="testimonials" style={{ background:'#f0ede8', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)' }}>
      <div style={{ maxWidth:860, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)', textAlign:'center' }}>
        <div ref={header.ref} style={{ opacity:header.vis?1:0, transform:header.vis?'none':'translateY(28px)', transition:'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)', marginBottom:'clamp(28px,5vw,52px)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(0,0,0,.28)', textTransform:'uppercase', marginBottom:12 }}>08</div>
          <h2 className="std" style={{ fontSize:'clamp(36px,8vw,130px)' }}>WHAT CLIENTS SAY</h2>
        </div>
        <div ref={content.ref} style={{ opacity:content.vis?1:0, transform:content.vis?'none':'translateY(28px)', transition:'opacity .8s .1s cubic-bezier(.16,1,.3,1),transform .8s .1s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:20, padding:'clamp(24px,5vw,40px) clamp(20px,5vw,36px)', marginBottom:24, boxShadow:'0 8px 32px rgba(0,0,0,0.06)', minHeight:'clamp(160px,25vw,220px)' }}>
            <div style={{ marginBottom:16 }}><Stars n={cur?.rating||5}/></div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(14px,2vw,18px)', fontWeight:300, lineHeight:1.8, color:'rgba(0,0,0,0.6)', maxWidth:640, margin:'0 auto 20px' }}>"{cur?.content}"</p>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(15px,2.5vw,18px)', letterSpacing:'.04em', color:'#000' }}>{cur?.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(11px,1.4vw,12px)', color:'rgba(0,0,0,0.38)', marginTop:3 }}>{cur?.role} · {cur?.company}</div>
          </div>
          {/* Dot navigation */}
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
            {items.map((_,i) => (
              <button key={i} onClick={()=>setActive(i)}
                style={{ width:i===active?'clamp(20px,4vw,28px)':8, height:8, borderRadius:50, background:i===active?'linear-gradient(90deg,#e040fb,#9c27b0)':'rgba(0,0,0,0.15)', border:'none', cursor:'pointer', transition:'all .3s cubic-bezier(.34,1.56,.64,1)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
