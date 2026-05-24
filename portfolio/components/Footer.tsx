'use client';
import { useEffect, useState } from 'react';
import SocialIcons from './SocialIcons';
import { getSiteSettings, getSocialLinks } from '@/lib/data';

export default function Footer() {
  const [footer, setFooter] = useState('© 2025 Nirbhava Sawant');
  const [links, setLinks] = useState<any[]>([]);
  useEffect(() => {
    getSiteSettings().then(s => { if (s?.footer_text) setFooter(s.footer_text); });
    getSocialLinks().then(d => { if (d?.length) setLinks(d); });
  }, []);
  return (
    <footer style={{ background:'#000', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'clamp(20px,4vw,32px) clamp(20px,5vw,44px)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:'.08em', color:'#fff' }}>NS</div>
      <SocialIcons links={links} />
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:300, color:'rgba(255,255,255,0.18)' }}>{footer}</div>
    </footer>
  );
}
