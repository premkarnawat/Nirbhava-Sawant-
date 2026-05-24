'use client';
import { useEffect, useState } from 'react';
import { getServices } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const FB = [
  { id:'s1', num:'01', title:'3D Design', description:'Creation of detailed objects, characters, or environments tailored to specific client needs.', tags:['Blender','Cinema 4D'] },
  { id:'s2', num:'02', title:'UI/UX Design', description:'Crafting intuitive, beautiful digital experiences from wireframes to polished interfaces.', tags:['Figma','Framer'] },
  { id:'s3', num:'03', title:'Branding', description:'Building memorable brand identities. Logo design, color systems, and comprehensive guidelines.', tags:['Identity','Strategy'] },
  { id:'s4', num:'04', title:'Motion Design', description:'Smooth, cinematic motion graphics and transitions that elevate digital presence.', tags:['After Effects','Motion'] },
];

function ServiceRow({ s, i, pv }: { s:any; i:number; pv:boolean }) {
  const [hov, setHov] = useState(false);
  const tags = Array.isArray(s.tags) ? s.tags : [];
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderBottom:'1px solid rgba(0,0,0,0.1)', padding:'clamp(20px,3vw,34px) 0', display:'grid', gridTemplateColumns:'clamp(44px,8vw,68px) 1fr', gap:'clamp(12px,2vw,20px) clamp(16px,3vw,28px)', alignItems:'start', background:hov?'rgba(0,0,0,0.05)':'transparent', transition:'background .3s,opacity .8s,transform .8s', opacity:pv?1:0, transform:pv?'none':'translateY(32px)', transitionDelay:`${i*.11}s` }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(32px,6vw,50px)', lineHeight:1, color:hov?'rgba(0,0,0,0.18)':'rgba(0,0,0,0.08)', userSelect:'none', transition:'color .3s' }}>{s.num}</div>
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8, marginBottom:8 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(18px,2.8vw,32px)', letterSpacing:'.03em', color:'#000', lineHeight:1 }}>{s.title}</div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {tags.map((t:string) => <div key={t} style={{ background:hov?'rgba(0,0,0,0.08)':'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)', borderRadius:50, padding:'3px clamp(8px,1.5vw,13px)', fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.2vw,10px)', fontWeight:500, color:'rgba(0,0,0,0.38)', letterSpacing:'.08em', transition:'background .3s', whiteSpace:'nowrap' }}>{t}</div>)}
          </div>
        </div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(12px,1.5vw,13px)', fontWeight:300, lineHeight:1.72, color:'rgba(0,0,0,0.42)', maxWidth:540 }}>{s.description}</div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [items, setItems] = useState<any[]>(FB);
  const header = useReveal(0.1);
  const rows = useReveal(0.05);
  useEffect(() => { getServices().then(d => { if (d?.length) setItems(d); }); }, []);
  return (
    <section id="services" style={{ background:'#f0ede8', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)' }}>
        <div ref={header.ref} style={{ opacity:header.vis?1:0, transform:header.vis?'none':'translateY(28px)', transition:'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(0,0,0,.28)', textTransform:'uppercase', marginBottom:12 }}>02</div>
          <h2 className="std" style={{ fontSize:'clamp(44px,9vw,150px)' }}>SERVICES</h2>
        </div>
        <div ref={rows.ref} style={{ marginTop:'clamp(24px,4vw,40px)' }}>
          {items.map((s,i) => <ServiceRow key={s.id||i} s={s} i={i} pv={rows.vis} />)}
        </div>
      </div>
    </section>
  );
}
