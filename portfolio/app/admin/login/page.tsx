'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/admin/dashboard');
  };

  const inp = { width:'100%', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:14, padding:'11px 14px', outline:'none' } as React.CSSProperties;
  const lbl = { fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase' as const, color:'rgba(255,255,255,.4)', marginBottom:6, display:'block' } as React.CSSProperties;

  return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ position:'fixed', top:'20%', left:'50%', transform:'translateX(-50%)', width:'min(600px,90vw)', height:'min(600px,90vw)', background:'radial-gradient(ellipse,rgba(100,20,160,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ width:'100%', maxWidth:400, position:'relative', zIndex:5 }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#e040fb,#7b1fa2)', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:'#fff', marginBottom:16, boxShadow:'0 0 28px rgba(156,39,176,0.4)' }}>NS</div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:'#fff', letterSpacing:'.04em' }}>Admin Panel</h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:6 }}>Nirbhava Sawant Portfolio CMS</p>
        </div>
        <form onSubmit={handle} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'clamp(24px,5vw,32px)', display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={lbl}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required style={inp} onFocus={e=>e.target.style.borderColor='rgba(156,39,176,.6)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/></div>
          <div><label style={lbl}>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required style={inp} onFocus={e=>e.target.style.borderColor='rgba(156,39,176,.6)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/></div>
          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#f87171' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ background:'linear-gradient(90deg,#e040fb,#9c27b0)', borderRadius:8, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', padding:'12px 20px', border:'none', cursor:'pointer', marginTop:4, opacity:loading?.7:1, transition:'opacity .2s' }}>
            {loading?'Signing in…':'Sign In'}
          </button>
        </form>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.18)', textAlign:'center', marginTop:24 }}>Protected admin area</p>
      </div>
    </div>
  );
}
