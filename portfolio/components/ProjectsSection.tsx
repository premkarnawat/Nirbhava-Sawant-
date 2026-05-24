'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const FB = [
  { id:'p1', num:'01', client:'CLIENT', sub:'Magma Studios', tags:['3D Design','Branding'], images:['https://images.unsplash.com/photo-1487530811015-780f2adb08af?w=600&q=75','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=75','https://images.unsplash.com/photo-1490750967868-88df5691cc72?w=400&q=75'], live_link:'https://example.com', CaseStudy:null },
  { id:'p2', num:'02', client:'CLIENT', sub:'PixForge', tags:['UI/UX','Web Design'], images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75','https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=400&q=75','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75'], live_link:'https://example.com',CaseStudy:'https://github.com' },
  { id:'p3', num:'03', client:'CLIENT', sub:'MetaMorph Creations', tags:['Motion','Branding'], images:['https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&q=75','https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=400&q=75','https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=75'], live_link:null, CaseStudy:'https://github.com' },
];

function ProjectCard({ p, i, pv }: { p:any; i:number; pv:boolean }) {
  const [hov, setHov] = useState(false);
  const imgs = Array.isArray(p.images) ? p.images : [];
  const tags = Array.isArray(p.tags) ? p.tags : [];
  return (
    <div className="pcard" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ marginBottom:14, opacity:pv?1:0, transform:pv?'none':'translateY(40px)', transition:`opacity .8s ${i*.14}s cubic-bezier(.16,1,.3,1),transform .8s ${i*.14}s cubic-bezier(.16,1,.3,1),border-color .35s,box-shadow .35s`, borderColor:hov?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.1)', boxShadow:hov?'0 24px 60px rgba(0,0,0,0.7)':'none' }}>
      <div style={{ padding:'clamp(14px,2vw,20px) clamp(16px,3vw,24px)', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'clamp(10px,2vw,18px)' }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(22px,4vw,34px)', lineHeight:1, color:'rgba(255,255,255,0.16)', userSelect:'none' }}>{p.num}</span>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(13px,2vw,17px)', letterSpacing:'.12em', color:'rgba(255,255,255,0.9)', lineHeight:1 }}>{p.client}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.2vw,10px)', color:'rgba(255,255,255,0.28)', marginTop:3 }}>{p.sub}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {tags.slice(0,2).map((t:string) => <span key={t} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:50, padding:'2px 8px', fontFamily:"'DM Sans',sans-serif", fontSize:9, color:'rgba(255,255,255,0.35)' }}>{t}</span>)}
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {p.github_link && <a href={p.github_link} target="_blank" rel="noopener noreferrer"><button className="lbtn">Case Study</button></a>}
          <Link href={`/case-study/${p.id}`}><button className="lbtn">live Link</button></Link>
          {p.live_link && <a href={p.live_link} target="_blank" rel="noopener noreferrer"><button className="lbtn" style={{ background:'rgba(156,39,176,0.1)', borderColor:'rgba(156,39,176,0.35)', color:'rgba(224,64,251,0.9)' }}>Live ↗</button></a>}
        </div>
      </div>
      {imgs.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:imgs.length>=3?'1.4fr 1fr 1fr':imgs.length===2?'1fr 1fr':'1fr', gap:8, padding:12, height:'clamp(110px,18vw,240px)' }}>
          {imgs.slice(0,3).map((img:string, j:number) => (
            <div key={j} style={{ borderRadius:10, overflow:'hidden', background:'rgba(255,255,255,0.02)' }}>
              <img src={img} alt="" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transform:hov?'scale(1.05)':'scale(1)', transition:'transform .65s cubic-bezier(.16,1,.3,1)' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>(FB);
  const header = useReveal(0.1);
  const cards = useReveal(0.05);
  useEffect(() => { getProjects().then(d => { if (d?.length) setProjects(d); }); }, []);
  return (
    <section id="projects" style={{ background:'#000', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'28%', right:'-8%', width:'42%', height:'48%', background:'radial-gradient(ellipse,rgba(95,25,155,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)' }}>
        <div ref={header.ref} style={{ marginBottom:'clamp(28px,5vw,48px)', opacity:header.vis?1:0, transform:header.vis?'none':'translateY(28px)', transition:'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(255,255,255,.22)', textTransform:'uppercase', marginBottom:12 }}>03</div>
          <h2 className="st" style={{ fontSize:'clamp(44px,9vw,150px)' }}>PROJECTS</h2>
        </div>
        <div ref={cards.ref}>
          {projects.map((p,i) => <ProjectCard key={p.id||i} p={p} i={i} pv={cards.vis} />)}
        </div>
      </div>
    </section>
  );
}
