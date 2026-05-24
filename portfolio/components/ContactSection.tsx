'use client';
import { useEffect, useState } from 'react';
import SocialIcons from './SocialIcons';
import { getSiteSettings, getSocialLinks, submitContact } from '@/lib/data';
import { useReveal } from '@/hooks/useReveal';

const Blob = ({ style }: { style: React.CSSProperties }) => (
  <div style={{ position:'absolute', animation:'bpulse 5s ease-in-out infinite', pointerEvents:'none', zIndex:2, ...style }} />
);

export default function ContactSection() {
  const [email, setEmail] = useState('nirbhava@design.com');
  const [links, setLinks] = useState<any[]>([]);
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const left = useReveal(0.1);
  const right = useReveal(0.1);

  useEffect(() => {
    getSiteSettings().then(s => { if (s?.contact_email) setEmail(s.contact_email); });
    getSocialLinks().then(d => { if (d?.length) setLinks(d); });
  }, []);

  const handleSend = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setError(''); setLoading(true);
    const ok = await submitContact(form);
    setLoading(false);
    if (ok) { setSent(true); setForm({ name:'', email:'', message:'' }); setTimeout(() => setSent(false), 4000); }
    else setError('Something went wrong. Please try again.');
  };

  return (
    <section id="contact" style={{ background:'#f0ede8', padding:'clamp(60px,10vw,100px) 0 clamp(40px,8vw,80px)', position:'relative', overflow:'hidden' }}>
      <Blob style={{ top:'7%', left:'3%', width:'clamp(44px,6vw,72px)', height:'clamp(44px,6vw,72px)', background:'linear-gradient(135deg,#8b5cf6,#c084fc)', borderRadius:'40% 60% 55% 45%/48% 52% 58% 42%', animationDelay:'.5s' }} />
      <Blob style={{ top:'10%', right:'4%', width:'clamp(36px,5vw,58px)', height:'clamp(36px,5vw,58px)', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', borderRadius:'55% 45% 42% 58%/42% 58% 48% 52%', animationDelay:'1.8s' }} />
      <Blob style={{ bottom:'9%', right:'5%', width:'clamp(30px,4vw,50px)', height:'clamp(30px,4vw,50px)', background:'linear-gradient(135deg,#ec4899,#be185d)', borderRadius:'48% 52% 60% 40%/55% 45% 50% 50%', animationDelay:'2.5s' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(20px,5vw,44px)', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'clamp(32px,6vw,80px)', alignItems:'start' }}>
        <div ref={left.ref} style={{ opacity:left.vis?1:0, transform:left.vis?'none':'translateX(-28px)', transition:'opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:'.22em', color:'rgba(0,0,0,.28)', textTransform:'uppercase', marginBottom:16 }}>10</div>
          <h2 className="std" style={{ lineHeight:.88, marginBottom:'clamp(20px,4vw,34px)', fontSize:'clamp(40px,8vw,150px)' }}>LET'S<br />GET IN<br />TOUCH</h2>
          <a href={`mailto:${email}`} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(12px,1.5vw,15px)', fontWeight:400, color:'rgba(0,0,0,0.45)', borderBottom:'1px solid rgba(0,0,0,0.18)', paddingBottom:2, display:'inline-block', textDecoration:'none', wordBreak:'break-all' }}>{email}</a>
          <div style={{ marginTop:'clamp(20px,3vw,32px)' }}>
            <SocialIcons links={links} light />
          </div>
        </div>

        <div ref={right.ref} style={{ opacity:right.vis?1:0, transform:right.vis?'none':'translateX(28px)', transition:'opacity .85s .15s cubic-bezier(.16,1,.3,1),transform .85s .15s cubic-bezier(.16,1,.3,1)' }}>
          <div style={{ background:'#000', borderRadius:20, padding:'clamp(20px,4vw,32px)', display:'flex', flexDirection:'column', gap:12 }}>
            <input className="inp" placeholder="Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
            <input className="inp" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
            <textarea className="inp" placeholder="Message" rows={4} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{ resize:'none' }} />
            {error && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#f87171' }}>{error}</p>}
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button className="cbtn" onClick={handleSend} disabled={loading} style={{ opacity:loading?.7:1 }}>
                {sent?'Sent ✓':loading?'Sending…':'Send →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
