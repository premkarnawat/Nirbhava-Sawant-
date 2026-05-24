'use client';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label:'About',         href:'#about' },
  { label:'Services',      href:'#services' },
  { label:'Experience',    href:'#experience' },
  { label:'Projects',      href:'#projects' },
  { label:'Certifications',href:'#certifications' },
  { label:'Testimonials',  href:'#testimonials' },
  { label:'Resume',        href:'#resume' },
  { label:'Contact',       href:'#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1));
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, height:64, display:'flex', alignItems:'center', padding:'0 clamp(16px,4vw,44px)', justifyContent:'space-between', background:(scrolled||open)?'rgba(0,0,0,0.92)':'transparent', backdropFilter:(scrolled||open)?'blur(20px)':'none', WebkitBackdropFilter:(scrolled||open)?'blur(20px)':'none', borderBottom:(scrolled||open)?'1px solid rgba(255,255,255,0.06)':'none', transition:'background 0.35s,border-color 0.35s' }}>
        {/* Logo */}
        <a href="#hero" onClick={() => setOpen(false)} style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(20px,3vw,24px)', letterSpacing:'0.08em', color:'#fff', textDecoration:'none', flexShrink:0 }}>NS</a>

        {/* Desktop links */}
        <div style={{ display:'flex', alignItems:'center', gap:'clamp(16px,2.5vw,28px)' }} className="nav-desktop">
          {NAV_LINKS.map(l => {
            const isActive = active === l.href.slice(1);
            return (
              <a key={l.label} href={l.href} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.1vw,11px)', fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', color:isActive?'#fff':'rgba(255,255,255,0.55)', textDecoration:'none', borderBottom:isActive?'1px solid rgba(224,64,251,0.7)':'1px solid transparent', paddingBottom:2, transition:'color 0.25s,border-color 0.25s', whiteSpace:'nowrap' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#fff')}
                onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.color='rgba(255,255,255,0.55)'; }}
              >{l.label}</a>
            );
          })}
          <a href="/admin/login" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(9px,1.1vw,10px)', fontWeight:600, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:50, padding:'5px 13px', textDecoration:'none', transition:'all 0.25s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(156,39,176,0.15)';e.currentTarget.style.borderColor='rgba(156,39,176,0.4)';e.currentTarget.style.color='rgba(224,64,251,0.9)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.color='rgba(255,255,255,0.35)';}}>
            Admin
          </a>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(o=>!o)} aria-label="Toggle menu" className="nav-hamburger"
          style={{ display:'none', flexDirection:'column', gap:5, background:'transparent', border:'none', cursor:'pointer', padding:8, zIndex:510, flexShrink:0 }}>
          <span style={{ display:'block', width:22, height:2, background:'#fff', borderRadius:2, transition:'transform 0.3s,opacity 0.3s', transform:open?'translateY(7px) rotate(45deg)':'none' }} />
          <span style={{ display:'block', width:22, height:2, background:'#fff', borderRadius:2, transition:'opacity 0.3s', opacity:open?0:1 }} />
          <span style={{ display:'block', width:22, height:2, background:'#fff', borderRadius:2, transition:'transform 0.3s', transform:open?'translateY(-7px) rotate(-45deg)':'none' }} />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div style={{ position:'fixed', inset:0, zIndex:490, background:'rgba(0,0,0,0.97)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity 0.35s ease' }}>
        {NAV_LINKS.map((l,i) => {
          const isActive = active === l.href.slice(1);
          return (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(28px,8vw,44px)', letterSpacing:'0.04em', color:isActive?'#fff':'rgba(255,255,255,0.45)', textDecoration:'none', padding:'10px 32px', display:'block', borderBottom:isActive?'2px solid rgba(224,64,251,0.7)':'2px solid transparent', transform:open?'translateY(0)':'translateY(20px)', opacity:open?1:0, transition:`color 0.2s,transform 0.4s ${i*0.04}s,opacity 0.4s ${i*0.04}s` }}
              onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateX(6px)';}}
              onMouseLeave={e=>{e.currentTarget.style.color=isActive?'#fff':'rgba(255,255,255,0.45)';e.currentTarget.style.transform='translateX(0)';}}>
              {l.label}
            </a>
          );
        })}
        <a href="/admin/login" onClick={() => setOpen(false)} style={{ marginTop:24, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(224,64,251,0.8)', background:'rgba(156,39,176,0.12)', border:'1px solid rgba(156,39,176,0.3)', borderRadius:50, padding:'10px 24px', textDecoration:'none', opacity:open?1:0, transform:open?'translateY(0)':'translateY(20px)', transition:`opacity 0.4s ${NAV_LINKS.length*0.04}s,transform 0.4s ${NAV_LINKS.length*0.04}s` }}>Admin Panel</a>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
