import Link from 'next/link';
import { getCaseStudy, getProjectById } from '@/lib/data';

export default async function CaseStudyPage({ params }: { params: { id: string } }) {
  const [project, cs] = await Promise.all([
    getProjectById(params.id),
    getCaseStudy(params.id),
  ]);

  const title  = project?.client || 'Case Study';
  const tags   = Array.isArray(project?.tags) ? project.tags : [];
  const imgs   = Array.isArray(project?.images) ? project.images : [];

  const sections = cs ? [
    { label:'Overview',       content: cs.overview },
    { label:'The Problem',    content: cs.problem },
    { label:'Research',       content: cs.research },
    { label:'Design Process', content: cs.process },
    { label:'Outcome',        content: cs.outcome },
  ].filter(s => s.content) : [];

  return (
    <div style={{ minHeight:'100vh', background:'#000', color:'#fff' }}>
      {/* Hero */}
      <section style={{ minHeight:'55vh', position:'relative', display:'flex', alignItems:'flex-end', overflow:'hidden', paddingBottom:64 }}>
        {imgs[0] && (
          <div style={{ position:'absolute', inset:0 }}>
            <img src={imgs[0]} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.28) saturate(0.7)' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 30%,#000 100%)' }} />
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%,rgba(100,20,160,0.2) 0%,transparent 70%)' }} />
          </div>
        )}
        {!imgs[0] && <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(100,20,160,0.3),transparent)' }} />}
        <div style={{ position:'relative', zIndex:5, maxWidth:1200, margin:'0 auto', padding:'clamp(80px,12vw,120px) clamp(20px,5vw,44px) 0', width:'100%' }}>
          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:28, textDecoration:'none', transition:'color .2s' }}>← Portfolio</Link>
          <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
            {tags.map((t:string) => <span key={t} style={{ background:'rgba(156,39,176,0.2)', border:'1px solid rgba(156,39,176,0.4)', borderRadius:50, padding:'4px 12px', fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'rgba(224,64,251,0.9)', letterSpacing:'.08em' }}>{t}</span>)}
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(44px,8vw,110px)', lineHeight:.88, color:'#fff', marginBottom:14 }}>{title}</h1>
          {project?.sub && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.45)', fontWeight:300 }}>{project.sub}</p>}
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'clamp(48px,8vw,80px) clamp(20px,5vw,44px)' }}>

        {/* Fallback if no case study */}
        {!cs && (
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'32px 28px', marginBottom:40, textAlign:'center' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>No case study added yet for this project.</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.25)' }}>Add one from the admin panel → Projects.</div>
          </div>
        )}

        {/* Case study sections */}
        {sections.map(sec => (
          <div key={sec.label} style={{ marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(26px,4vw,48px)', color:'#fff', marginBottom:16 }}>{sec.label}</h2>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(14px,1.8vw,16px)', fontWeight:300, lineHeight:1.85, color:'rgba(255,255,255,0.55)' }}>{sec.content}</p>
          </div>
        ))}

        {/* Metrics */}
        {cs?.metrics?.length > 0 && (
          <div style={{ marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(26px,4vw,48px)', color:'#fff', marginBottom:20 }}>Results</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14 }}>
              {cs.metrics.map((m:string, i:number) => (
                <div key={i} style={{ background:'rgba(156,39,176,0.08)', border:'1px solid rgba(156,39,176,0.2)', borderRadius:14, padding:'18px 16px' }}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:400, color:'rgba(224,64,251,0.85)', lineHeight:1.5 }}>{m}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {cs?.tools?.length > 0 && (
          <div style={{ marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(26px,4vw,48px)', color:'#fff', marginBottom:16 }}>Tools Used</h2>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {cs.tools.map((t:string) => <div key={t} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:50, padding:'7px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,0.42)' }}>{t}</div>)}
            </div>
          </div>
        )}

        {/* Gallery */}
        {(cs?.gallery?.length > 0 || imgs.length > 0) && (
          <div style={{ marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(26px,4vw,48px)', color:'#fff', marginBottom:20 }}>Gallery</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(clamp(180px,30vw,240px),1fr))', gap:12 }}>
              {(cs?.gallery?.length > 0 ? cs.gallery : imgs).map((img:string, i:number) => (
                <div key={i} style={{ borderRadius:12, overflow:'hidden', aspectRatio:'4/3' }}>
                  <img src={img} alt="" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.85)', transition:'transform .5s cubic-bezier(.16,1,.3,1),filter .3s', display:'block' }}
                    onMouseEnter={e=>{(e.target as HTMLImageElement).style.transform='scale(1.04)';(e.target as HTMLImageElement).style.filter='brightness(1)';}}
                    onMouseLeave={e=>{(e.target as HTMLImageElement).style.transform='scale(1)';(e.target as HTMLImageElement).style.filter='brightness(0.85)';}} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live link */}
        {project?.live_link && (
          <div style={{ marginBottom:48 }}>
            <a href={project.live_link} target="_blank" rel="noopener noreferrer">
              <button style={{ background:'linear-gradient(90deg,#e040fb,#9c27b0)', backgroundSize:'200%', border:'none', borderRadius:50, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, letterSpacing:'.2em', textTransform:'uppercase', padding:'13px 28px', cursor:'pointer', transition:'transform .25s,box-shadow .25s' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.04)';e.currentTarget.style.boxShadow='0 0 28px rgba(156,39,176,0.5)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                View Live Project ↗
              </button>
            </a>
          </div>
        )}

        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', borderBottom:'1px solid rgba(255,255,255,0.12)', paddingBottom:2, textDecoration:'none', transition:'color .25s' }}
          onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,0.65)')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.35)')}>
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
