'use client';
import { useEffect, useState } from 'react';
import { getCertifications } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const FB = [
  { id:'c1', title:'Google UX Design Professional', issuer:'Google / Coursera', date:'Mar 2024', category:'UX', featured:true, description:'Comprehensive UX design certification covering empathy, prototyping, and usability testing.', credential_url:'https://coursera.org', image:null },
  { id:'c2', title:'Meta Front-End Developer', issuer:'Meta / Coursera', date:'Jan 2024', category:'Dev', featured:true, description:'Professional certificate in modern front-end development including React and accessibility.', credential_url:'https://coursera.org', image:null },
  { id:'c3', title:'Blender 3D Masterclass', issuer:'Udemy', date:'Nov 2023', category:'3D', featured:false, description:'Advanced 3D modeling, texturing, rigging, and rendering in Blender.', credential_url:'https://udemy.com', image:null },
  { id:'c4', title:'Motion Design — After Effects', issuer:'School of Motion', date:'Aug 2023', category:'Motion', featured:false, description:'Professional motion graphics and animation certification from industry leaders.', credential_url:'https://schoolofmotion.com', image:null },
  { id:'c5', title:'Figma Advanced UI Design', issuer:'Figma Academy', date:'Jun 2023', category:'Design', featured:true, description:'Advanced design systems, component libraries, auto-layout, and collaboration workflows.', credential_url:'https://figma.com', image:null },
  { id:'c6', title:'AWS Cloud Practitioner', issuer:'Amazon Web Services', date:'Apr 2023', category:'Cloud', featured:false, description:'Foundational cloud computing knowledge and AWS services overview.', credential_url:'https://aws.amazon.com', image:null },
];

const BADGE: Record<string,string> = { UX:'🎓', Dev:'💻', '3D':'🎨', Motion:'✨', Design:'🖼️', Cloud:'☁️', Other:'📜' };
const ALL_CATS = ['All','UX','Dev','3D','Motion','Design','Cloud','Other'];

export default function CertificationsSection() {
  const [items, setItems] = useState<any[]>(FB);
  const [active, setActive] = useState('All');
  const [hovered, setHovered] = useState<string|null>(null);
  const header = useReveal(0.1);
  const grid   = useReveal(0.05);

  useEffect(() => { getCertifications().then(d => { if (d?.length) setItems(d); }); }, []);

  const cats = ALL_CATS.filter(c => c === 'All' || items.some(i => i.category === c));
  const filtered = active === 'All' ? items : items.filter(c => c.category === active);

  return (
    <section id="certifications" style={{ background:'#000', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'20%', right:'-8%', width:'40%', height:'60%', background:'radial-gradient(ellipse,rgba(100,20,160,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)' }}>

        {/* Header */}
        <div ref={header.ref} style={{ opacity:header.vis?1:0, transform:header.vis?'none':'translateY(28px)', transition:'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)', marginBottom:'clamp(24px,4vw,40px)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(255,255,255,.22)', textTransform:'uppercase', marginBottom:12 }}>07</div>
          <h2 className="st" style={{ fontSize:'clamp(36px,8vw,130px)' }}>CERTIFICATIONS<br/>&amp; AWARDS</h2>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:'clamp(6px,1vw,8px)', flexWrap:'wrap', marginBottom:'clamp(24px,4vw,40px)', opacity:header.vis?1:0, transition:'opacity .8s .2s' }}>
          {cats.map(cat => (
            <button key={cat} onClick={()=>setActive(cat)}
              style={{ background:active===cat?'rgba(156,39,176,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${active===cat?'rgba(156,39,176,0.4)':'rgba(255,255,255,0.09)'}`, color:active===cat?'rgba(224,64,251,0.9)':'rgba(255,255,255,0.45)', borderRadius:50, padding:'clamp(5px,1vw,7px) clamp(12px,2vw,16px)', fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.5vw,11px)', fontWeight:500, cursor:'pointer', transition:'all .25s' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div ref={grid.ref} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(240px,30vw,300px),1fr))', gap:'clamp(10px,2vw,16px)' }}>
          {filtered.map((cert, i) => {
            const isHov = hovered === cert.id;
            return (
              <div key={cert.id}
                onMouseEnter={()=>setHovered(cert.id)} onMouseLeave={()=>setHovered(null)}
                style={{ background:isHov?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.02)', border:`1px solid ${isHov?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.08)'}`, borderRadius:16, padding:'clamp(16px,3vw,24px) clamp(14px,2.5vw,22px)', transition:'all .35s cubic-bezier(.16,1,.3,1)', transform:isHov?'translateY(-4px)':'none', boxShadow:isHov?'0 20px 48px rgba(0,0,0,0.5)':'none', opacity:grid.vis?1:0, transitionDelay:`${i*.07}s`, cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'clamp(10px,2vw,16px)' }}>
                  <div style={{ fontSize:'clamp(20px,3vw,28px)' }}>{BADGE[cert.category]||'📜'}</div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'flex-end' }}>
                    {cert.featured && <span style={{ background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', color:'#fbbf24', borderRadius:50, padding:'2px 8px', fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'.1em' }}>FEATURED</span>}
                    <span style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', borderRadius:50, padding:'2px 8px', fontFamily:"'DM Sans',sans-serif", fontSize:9 }}>{cert.category}</span>
                  </div>
                </div>
                {cert.image && <img src={cert.image} alt={cert.title} style={{ width:'100%', height:90, objectFit:'cover', borderRadius:8, marginBottom:12 }} loading="lazy"/>}
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(15px,2.5vw,20px)', letterSpacing:'.03em', color:'#fff', lineHeight:1.1, marginBottom:5 }}>{cert.title}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.3vw,12px)', color:'rgba(255,255,255,0.4)', marginBottom:cert.description?8:12 }}>{cert.issuer}</div>
                {cert.description && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(11px,1.3vw,12px)', fontWeight:300, lineHeight:1.65, color:'rgba(255,255,255,0.38)', marginBottom:14 }}>{cert.description}</p>}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.3vw,11px)', color:'rgba(255,255,255,0.28)' }}>{cert.date}</span>
                  {cert.credential_url && <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.2vw,10px)', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(224,64,251,0.8)', textDecoration:'none' }}>View ↗</a>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
