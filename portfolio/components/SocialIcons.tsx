'use client';
import { useState } from 'react';

interface SocialLink { platform: string; url: string; }

const ICONS: Record<string, React.ReactNode> = {
  Instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  Twitter: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  LinkedIn: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  GitHub: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  Behance: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.26zm-7.726-3h3.427c-.123-1.979-1.361-2.558-1.79-2.558-.61 0-1.436.39-1.637 2.558zM6.466 13.34c1.545 0 2.36.755 2.36 2.203 0 1.473-.97 2.181-2.626 2.181H3V7h3.2c1.462 0 2.509.602 2.509 1.988 0 .951-.484 1.59-1.243 1.868v.03c.997.186 1 .948 1 2.454zm-1.6-4.66H4.5v2.5h.366C5.832 11.18 6.2 10.7 6.2 10.17c0-.748-.362-1.49-1.334-1.49zm.128 4.04H4.5v2.7h.494c1.122 0 1.683-.479 1.683-1.358 0-.875-.561-1.342-1.683-1.342z"/></svg>,
  Dribbble: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
  YouTube: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="black"/></svg>,
  Website: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

const GLOWS: Record<string, string> = {
  Instagram:'rgba(225,48,108,0.45)', Twitter:'rgba(29,161,242,0.45)',
  LinkedIn:'rgba(10,102,194,0.45)', GitHub:'rgba(200,200,200,0.3)',
  Behance:'rgba(19,120,234,0.45)', Dribbble:'rgba(234,76,137,0.45)',
  YouTube:'rgba(255,0,0,0.4)', Website:'rgba(156,39,176,0.4)',
};

const DEFAULT_LINKS: SocialLink[] = [
  { platform:'Instagram', url:'https://instagram.com' },
  { platform:'LinkedIn',  url:'https://linkedin.com' },
  { platform:'GitHub',    url:'https://github.com' },
  { platform:'Behance',   url:'https://behance.net' },
];

export default function SocialIcons({ links, size = 40, light = false }: { links?: SocialLink[]; size?: number; light?: boolean }) {
  const [hovered, setHovered] = useState<string|null>(null);
  const items = (links && links.length > 0) ? links : DEFAULT_LINKS;

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
      {items.map(link => {
        const icon = ICONS[link.platform];
        if (!icon) return null;
        const isHov = hovered === link.platform;
        const glow = GLOWS[link.platform] ?? 'rgba(255,255,255,0.2)';
        return (
          <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHovered(link.platform)}
            onMouseLeave={() => setHovered(null)}
            style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center', width:size, height:size, borderRadius:'50%', background:light?(isHov?'rgba(0,0,0,0.08)':'rgba(0,0,0,0.04)'):(isHov?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)'), border:light?`1px solid ${isHov?'rgba(0,0,0,0.2)':'rgba(0,0,0,0.1)'}`:`1px solid ${isHov?'rgba(255,255,255,0.28)':'rgba(255,255,255,0.1)'}`, color:light?(isHov?'#111':'rgba(0,0,0,0.5)'):(isHov?'#fff':'rgba(255,255,255,0.6)'), transform:isHov?'translateY(-3px)':'none', boxShadow:isHov?`0 8px 24px ${glow}`:'none', transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', textDecoration:'none', flexShrink:0 }}>
            {icon}
            <span style={{ position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:`translateX(-50%) translateY(${isHov?'0px':'5px'})`, background:'rgba(8,8,8,0.96)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:500, letterSpacing:'.08em', padding:'4px 10px', borderRadius:6, whiteSpace:'nowrap', opacity:isHov?1:0, pointerEvents:'none', transition:'opacity 0.2s,transform 0.2s', zIndex:20 }}>{link.platform}</span>
          </a>
        );
      })}
    </div>
  );
}
