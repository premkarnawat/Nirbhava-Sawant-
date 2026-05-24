'use client';
import { useEffect, useState } from 'react';
import { getExperiences } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const FB = [
  { id:'e1', company:'Studio Nexus', role:'Senior 3D Designer', start_date:'Jan 2023', end_date:null, current:true, description:'Led 3D design for 15+ premium brand projects. Directed motion system design and mentored junior designers.', tags:['Blender','Cinema 4D','Motion'] },
  { id:'e2', company:'PixForge Labs', role:'UI/UX Designer', start_date:'Mar 2021', end_date:'Dec 2022', current:false, description:'Designed end-to-end product experiences for SaaS clients. Improved conversion rates by an average of 42%.', tags:['Figma','Framer','User Research'] },
  { id:'e3', company:'Freelance', role:'Brand Designer', start_date:'Jun 2019', end_date:'Feb 2021', current:false, description:'Delivered brand identities for 30+ clients across industries including fintech, health, and lifestyle.', tags:['Branding','Illustration','Strategy'] },
];

export default function ExperienceSection() {
  const [items, setItems] = useState<any[]>(FB);
  const header = useReveal(0.1);
  const list = useReveal(0.05);
  useEffect(() => { getExperiences().then(d => { if (d?.length) setItems(d); }); }, []);

  return (
    <section id="experience" style={{ background:'#000', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)', position:'relative' }}>
      <div style={{ position:'absolute', top:'30%', left:'-5%', width:'35%', height:'50%', background:'radial-gradient(ellipse,rgba(80,20,140,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)' }}>
        <div ref={header.ref} style={{ opacity:header.vis?1:0, transform:header.vis?'none':'translateY(28px)', transition:'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)', marginBottom:'clamp(28px,5vw,56px)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(255,255,255,.22)', textTransform:'uppercase', marginBottom:12 }}>05</div>
          <h2 className="st" style={{ fontSize:'clamp(44px,9vw,150px)' }}>EXPERIENCE</h2>
        </div>
        <div ref={list.ref} style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:'clamp(13px,2vw,19px)', top:0, bottom:0, width:1, background:'linear-gradient(to bottom,rgba(156,39,176,0.4),transparent)', zIndex:0 }} />
          {items.map((exp, i) => (
            <div key={exp.id||i} style={{ display:'grid', gridTemplateColumns:'clamp(28px,4vw,40px) 1fr', gap:'clamp(16px,3vw,28px)', marginBottom:'clamp(24px,5vw,48px)', opacity:list.vis?1:0, transform:list.vis?'none':'translateY(28px)', transition:`opacity .8s ${i*.12}s cubic-bezier(.16,1,.3,1),transform .8s ${i*.12}s cubic-bezier(.16,1,.3,1)`, position:'relative', zIndex:1 }}>
              <div style={{ width:'clamp(8px,1.5vw,10px)', height:'clamp(8px,1.5vw,10px)', borderRadius:'50%', background:exp.current?'linear-gradient(135deg,#e040fb,#9c27b0)':'rgba(255,255,255,0.2)', border:`2px solid ${exp.current?'rgba(224,64,251,0.5)':'rgba(255,255,255,0.1)'}`, marginTop:6, flexShrink:0, boxShadow:exp.current?'0 0 12px rgba(156,39,176,0.5)':'none' }} />
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'clamp(16px,3vw,22px) clamp(16px,3vw,24px)', transition:'border-color .3s' }} onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.16)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.08)')}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:10 }}>
                  <div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(18px,3vw,22px)', letterSpacing:'.04em', color:'#fff', lineHeight:1 }}>{exp.role}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(11px,1.5vw,13px)', color:'rgba(255,255,255,0.45)', marginTop:4 }}>{exp.company}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    {exp.current && <span style={{ background:'rgba(74,222,128,0.12)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80', borderRadius:50, padding:'2px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:'.1em' }}>CURRENT</span>}
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.3vw,11px)', color:'rgba(255,255,255,0.3)' }}>{exp.start_date} – {exp.current?'Present':exp.end_date}</span>
                  </div>
                </div>
                {exp.description && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(12px,1.5vw,13px)', fontWeight:300, lineHeight:1.7, color:'rgba(255,255,255,0.48)', marginBottom:(exp.tags?.length>0)?14:0 }}>{exp.description}</p>}
                {exp.tags?.length > 0 && (
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {exp.tags.map((t:string) => <span key={t} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:50, padding:'3px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.2vw,10px)', color:'rgba(255,255,255,0.38)' }}>{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
