'use client';
import { useEffect, useState } from 'react';
import { getAbout } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const FB_LINES = ['With over five years of experience in the design industry,','I specialize in branding, web design and 3D visualization.',"I love collaborating with businesses to tell their story and shape how they're seen by the world."];
const FB_SKILLS = ['3D Modeling','Blender','Figma','After Effects','Branding','Web Design','Motion','UI/UX'];

const Blob = ({ style }: { style: React.CSSProperties }) => (
  <div style={{ position:'absolute', animation:'bpulse 5s ease-in-out infinite', pointerEvents:'none', zIndex:2, ...style }} />
);

export default function AboutSection() {
  const [lines, setLines] = useState(FB_LINES);
  const [skills, setSkills] = useState(FB_SKILLS);
  const h = useReveal(0.1); const t = useReveal(0.1); const s = useReveal(0.1);

  useEffect(() => {
    getAbout().then(d => {
      if (!d) return;
      if (d.content?.length) setLines(d.content);
      if (d.skills?.length) setSkills(d.skills);
    });
  }, []);

  return (
    <section id="about" style={{ position:'relative', minHeight:'80vh', background:'#000', display:'flex', alignItems:'center', overflow:'hidden', padding:'clamp(60px,10vw,100px) 0' }}>
      <Blob style={{ top:'7%', left:'4%', width:'clamp(48px,7vw,88px)', height:'clamp(48px,7vw,88px)', background:'linear-gradient(135deg,#ccccd8,#a8a8c4)', borderRadius:'40% 60% 55% 45%/48% 52% 58% 42%' }} />
      <Blob style={{ top:'5%', right:'5%', width:'clamp(40px,6vw,74px)', height:'clamp(40px,6vw,74px)', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius:'55% 45% 40% 60%/45% 58% 42% 55%', animationDelay:'1.2s' }} />
      <Blob style={{ bottom:'11%', right:'6%', width:'clamp(34px,5vw,62px)', height:'clamp(34px,5vw,62px)', background:'linear-gradient(135deg,#ec4899,#c026d3)', borderRadius:'48% 52% 60% 40%/55% 42% 58% 45%', animationDelay:'2.1s' }} />
      <Blob style={{ bottom:'18%', left:'7%', width:'clamp(28px,4vw,48px)', height:'clamp(28px,4vw,48px)', background:'linear-gradient(135deg,#f59e0b,#ef4444)', borderRadius:'52% 48% 42% 58%/40% 60% 48% 52%', animationDelay:'.8s' }} />
      <div style={{ width:'100%', maxWidth:900, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)', textAlign:'center', position:'relative', zIndex:5 }}>
        <div ref={h.ref} style={{ opacity:h.vis?1:0, transform:h.vis?'none':'translateY(28px)', transition:'opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(255,255,255,.22)', textTransform:'uppercase', marginBottom:16 }}>01</div>
          <h2 className="st" style={{ marginBottom:'clamp(28px,5vw,50px)', fontSize:'clamp(44px,9vw,150px)' }}>ABOUT ME</h2>
        </div>
        <div ref={t.ref}>
          {lines.map((line, i) => (
            <p key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(14px,2vw,19px)', fontWeight:300, lineHeight:1.88, color:'rgba(255,255,255,0.52)', maxWidth:680, margin:'0 auto 12px', letterSpacing:'.01em', opacity:t.vis?1:0, transform:t.vis?'none':`translateY(22px)`, transition:`opacity .8s ${.1+i*.12}s cubic-bezier(.16,1,.3,1),transform .8s ${.1+i*.12}s cubic-bezier(.16,1,.3,1)` }}>{line}</p>
          ))}
        </div>
        <div ref={s.ref} style={{ display:'flex', flexWrap:'wrap', gap:'clamp(6px,1vw,10px)', justifyContent:'center', marginTop:'clamp(24px,4vw,40px)' }}>
          {skills.map((sk, i) => (
            <div key={sk} className="chip" style={{ opacity:s.vis?1:0, transform:s.vis?'none':'translateY(16px) scale(0.94)', transition:`opacity .6s ${i*.07}s cubic-bezier(.16,1,.3,1),transform .6s ${i*.07}s cubic-bezier(.16,1,.3,1)`, fontSize:'clamp(10px,1.5vw,11px)', padding:'clamp(5px,1vw,7px) clamp(12px,2vw,17px)' }}>{sk}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
