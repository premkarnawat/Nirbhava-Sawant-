'use client';
import { useEffect, useState } from 'react';
import { getResume } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

export default function ResumeSection() {
  const [resume, setResume] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const header = useReveal(0.1);
  const card   = useReveal(0.1);

  useEffect(() => { getResume().then(d => { if (d) setResume(d); }); }, []);

  const handleDownload = () => {
    if (!resume?.file_url) return;
    setDownloading(true);
    window.open(resume.file_url, '_blank');
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <section id="resume" style={{ background:'#000', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:'20%', left:'-5%', width:'38%', height:'50%', background:'radial-gradient(ellipse,rgba(80,20,140,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:800, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)', textAlign:'center' }}>
        <div ref={header.ref} style={{ opacity:header.vis?1:0, transform:header.vis?'none':'translateY(28px)', transition:'opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)', marginBottom:'clamp(28px,5vw,52px)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(255,255,255,.22)', textTransform:'uppercase', marginBottom:12 }}>09</div>
          <h2 className="st" style={{ fontSize:'clamp(44px,9vw,150px)' }}>RESUME</h2>
        </div>
        <div ref={card.ref} style={{ opacity:card.vis?1:0, transform:card.vis?'none':'translateY(32px)', transition:'opacity .9s .1s cubic-bezier(.16,1,.3,1),transform .9s .1s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'clamp(28px,6vw,48px) clamp(20px,5vw,36px)', marginBottom:24, position:'relative', overflow:'hidden' }}>
            {/* Top accent line */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#e040fb,#9c27b0)' }} />
            {/* Icon */}
            <div style={{ width:'clamp(52px,8vw,72px)', height:'clamp(52px,8vw,72px)', borderRadius:16, background:'linear-gradient(135deg,rgba(224,64,251,0.15),rgba(156,39,176,0.1))', border:'1px solid rgba(156,39,176,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto clamp(16px,3vw,24px)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(224,64,251,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(20px,4vw,28px)', letterSpacing:'.04em', color:'#fff', marginBottom:6 }}>Nirbhava Sawant — CV</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(11px,1.5vw,13px)', color:'rgba(255,255,255,0.35)', marginBottom:4 }}>3D Designer · UI/UX · Brand Identity</div>
            {resume && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.3vw,11px)', color:'rgba(255,255,255,0.22)', marginBottom:'clamp(20px,4vw,32px)' }}>Updated: {resume.version||'Latest'} · PDF · {resume.file_name}</div>}
            {!resume && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.3vw,11px)', color:'rgba(255,255,255,0.18)', marginBottom:'clamp(20px,4vw,32px)' }}>Upload your resume from the admin panel</div>}
            <div style={{ display:'flex', gap:'clamp(10px,2vw,14px)', justifyContent:'center', flexWrap:'wrap' }}>
              <button className="cbtn" onClick={handleDownload}
                disabled={downloading||!resume}
                style={{ opacity:(downloading||!resume)?.5:1, fontSize:'clamp(10px,1.5vw,11px)', padding:'clamp(10px,2vw,13px) clamp(18px,4vw,26px)' }}>
                {downloading?'Opening…':'↓ Download Resume'}
              </button>
              {resume?.file_url && (
                <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                  <button style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:50, color:'rgba(255,255,255,0.65)', fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(10px,1.5vw,11px)', fontWeight:600, letterSpacing:'.16em', textTransform:'uppercase', padding:'clamp(10px,2vw,13px) clamp(18px,4vw,24px)', cursor:'pointer', transition:'all .25s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='#fff';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.65)';}}>
                    ↗ View Online
                  </button>
                </a>
              )}
            </div>
          </div>
          {/* Stats strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(255,255,255,0.05)', borderRadius:14, overflow:'hidden' }}>
            {[['5+','Years Exp'],['50+','Projects'],['30+','Clients']].map(([n,l]) => (
              <div key={l} style={{ background:'#000', padding:'clamp(16px,4vw,24px) 16px', textAlign:'center' }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(28px,6vw,36px)', background:'linear-gradient(135deg,#e040fb,#9c27b0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{n}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.2vw,10px)', color:'rgba(255,255,255,0.3)', letterSpacing:'.1em', textTransform:'uppercase', marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
