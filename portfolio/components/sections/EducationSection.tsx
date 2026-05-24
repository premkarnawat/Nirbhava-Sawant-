'use client';
import { useEffect, useState } from 'react';
import { getEducation } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const FB = [
  { id:'ed1', institution:'National Institute of Design', degree:'Bachelor of Design', field:'Communication Design', start_year:2015, end_year:2019, grade:'GPA 3.8 / 4.0', description:'Specialized in visual communication, typography, and interactive media.' },
  { id:'ed2', institution:'Coursera / Google', degree:'Professional Certificate', field:'UX Design', start_year:2021, end_year:2021, grade:'Distinction', description:'Seven-course program covering the full UX design process.' },
];

export default function EducationSection() {
  const [items, setItems] = useState<any[]>(FB);
  const header = useReveal(0.1);
  const cards = useReveal(0.05);
  useEffect(() => { getEducation().then(d => { if (d?.length) setItems(d); }); }, []);

  return (
    <section id="education" style={{ background:'#f0ede8', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)' }}>
        <div ref={header.ref} style={{ opacity:header.vis?1:0, transform:header.vis?'none':'translateY(28px)', transition:'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)', marginBottom:'clamp(28px,5vw,52px)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(0,0,0,.28)', textTransform:'uppercase', marginBottom:12 }}>06</div>
          <h2 className="std" style={{ fontSize:'clamp(44px,9vw,150px)' }}>EDUCATION</h2>
        </div>
        <div ref={cards.ref} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(clamp(240px,40vw,320px),1fr))', gap:'clamp(10px,2vw,16px)' }}>
          {items.map((ed, i) => (
            <div key={ed.id||i} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:'clamp(18px,3vw,28px) clamp(16px,3vw,24px)', transition:'box-shadow .3s,transform .3s', opacity:cards.vis?1:0, transform:cards.vis?'none':'translateY(28px)', transitionDelay:`${i*.12}s` }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.1)';e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='none';}}>
              <div style={{ width:'clamp(32px,5vw,40px)', height:'clamp(32px,5vw,40px)', borderRadius:'50%', background:'linear-gradient(135deg,#e040fb,#9c27b0)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'clamp(12px,2vw,16px)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(16px,2.5vw,20px)', letterSpacing:'.03em', color:'#000', lineHeight:1, marginBottom:3 }}>{ed.degree}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(12px,1.5vw,13px)', color:'rgba(0,0,0,0.5)', marginBottom:2 }}>{ed.field}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(11px,1.3vw,12px)', color:'rgba(0,0,0,0.35)', marginBottom:'clamp(10px,2vw,14px)' }}>{ed.institution}</div>
              {ed.description && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(11px,1.3vw,13px)', fontWeight:300, lineHeight:1.65, color:'rgba(0,0,0,0.45)', marginBottom:'clamp(12px,2vw,16px)' }}>{ed.description}</p>}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:6 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.3vw,11px)', color:'rgba(0,0,0,0.35)' }}>{ed.start_year}–{ed.end_year||'Present'}</span>
                {ed.grade && <span style={{ background:'rgba(156,39,176,0.1)', border:'1px solid rgba(156,39,176,0.2)', color:'rgba(156,39,176,0.9)', borderRadius:50, padding:'2px 10px', fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.2vw,10px)' }}>{ed.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
