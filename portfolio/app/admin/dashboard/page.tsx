'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signOut, getUser } from '@/lib/auth';
import ImageUpload from '@/components/admin/ImageUpload';

type Tab = 'overview'|'hero'|'about'|'skills'|'projects'|'services'|'experience'|'education'|'certifications'|'resume'|'testimonials'|'social'|'contacts'|'blog'|'gallery'|'settings';

/* ── Primitives ─────────────────────────── */
const inp = { width:'100%', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:13, padding:'10px 13px', outline:'none' } as React.CSSProperties;
const lbl = { fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500 as const, letterSpacing:'.1em', textTransform:'uppercase' as const, color:'rgba(255,255,255,.4)', marginBottom:5, display:'block' };

const F = ({ label, value, onChange, type='text', placeholder='', rows=0 }: any) => (
  <div style={{ marginBottom:13 }}>
    <label style={lbl}>{label}</label>
    {rows>0
      ? <textarea value={value||''} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{ ...inp, resize:'vertical' as const }}
          onFocus={e=>e.target.style.borderColor='rgba(156,39,176,.6)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
      : <input type={type} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inp}
          onFocus={e=>e.target.style.borderColor='rgba(156,39,176,.6)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.1)'}/>
    }
  </div>
);

const Sel = ({ label, value, onChange, options }: any) => (
  <div style={{ marginBottom:13 }}>
    <label style={lbl}>{label}</label>
    <select value={value||''} onChange={e=>onChange(e.target.value)}
      style={{ ...inp, background:'#111' }}>
      {options.map((o:string)=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Toggle = ({ label, value, onChange }: any) => (
  <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,.55)', marginBottom:12 }}>
    <div onClick={()=>onChange(!value)} style={{ width:36, height:20, borderRadius:10, background:value?'linear-gradient(90deg,#e040fb,#9c27b0)':'rgba(255,255,255,.12)', position:'relative', transition:'background .25s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left:value?18:3, width:14, height:14, borderRadius:'50%', background:'#fff', transition:'left .25s' }}/>
    </div>
    {label}
  </label>
);

const Btn = ({ children, onClick, disabled, v='primary' }: any) => {
  const s: any = {
    primary: { background:'linear-gradient(90deg,#e040fb,#9c27b0)', color:'#fff', border:'none' },
    ghost:   { background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.7)' },
    danger:  { background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', color:'#f87171' },
    success: { background:'rgba(74,222,128,.1)', border:'1px solid rgba(74,222,128,.25)', color:'#4ade80' },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...s[v], borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:'.08em', padding:'9px 18px', cursor:'pointer', transition:'opacity .2s,transform .2s', opacity:disabled?.45:1 }}>{children}</button>;
};

const Card = ({ children, style={} }: any) => (
  <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:20, ...style }}>{children}</div>
);

const Row = ({ children, style={} }: any) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, ...style }}>{children}</div>
);

const G2 = ({ children }: any) => (
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>{children}</div>
);

/* ── CRUD hook ──────────────────────────── */
function useCRUD(table: string) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select('*').order('sort_order', { ascending: true }).catch(()=>({data:[]}));
    setItems(data||[]); setLoading(false);
  }, [table]);
  useEffect(() => { load(); }, [load]);
  const del = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from(table).delete().eq('id', id); load(); };
  const upsert = async (payload: any, id?: string) => {
    if (id) await supabase.from(table).update(payload).eq('id', id);
    else    await supabase.from(table).insert(payload);
    load();
  };
  const toggle = async (id: string, field: string, val: boolean) => { await supabase.from(table).update({ [field]: !val }).eq('id', id); load(); };
  return { items, loading, load, del, upsert, toggle };
}

/* ── Single panel ───────────────────────── */
function SinglePanel({ table, title, children }: { table:string; title:string; children:(data:any,set:(k:string)=>(v:any)=>void)=>React.ReactNode }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    supabase.from(table).select('*').single().then(({ data: d }) => { if (d) setData(d); setLoading(false); });
  }, [table]);
  const save = async () => {
    setSaving(true);
    if (data.id) await supabase.from(table).update(data).eq('id', data.id);
    else         await supabase.from(table).insert(data);
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };
  const set = (k: string) => (v: any) => setData((p:any) => ({ ...p, [k]: v }));
  if (loading) return <div style={{ height:300, background:'rgba(255,255,255,.04)', borderRadius:12 }}/>;
  return (
    <div>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, color:'#fff', marginBottom:24 }}>{title}</h2>
      <Card>{children(data, set)}<div style={{ marginTop:8 }}><Btn onClick={save} disabled={saving}>{saved?'Saved ✓':saving?'Saving…':'Save Changes'}</Btn></div></Card>
    </div>
  );
}

/* ── List panel ─────────────────────────── */
function ListPanel({ table, title, addLabel, renderForm, renderRow, emptyForm }: any) {
  const { items, loading, del, upsert, toggle } = useCRUD(table);
  const [editing, setEditing] = useState<any|null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const setF = (k:string) => (v:any) => setForm((p:any) => ({ ...p, [k]: v }));
  const openEdit = (item:any) => { setEditing(item); setForm({ ...emptyForm, ...item }); };
  const openNew  = () => { setEditing({}); setForm(emptyForm); };
  const doSave   = async () => { setSaving(true); await upsert(form, editing?.id); setSaving(false); setEditing(null); };

  return (
    <div>
      <Row style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, color:'#fff' }}>{title}</h2>
        <Btn onClick={openNew}>+ {addLabel}</Btn>
      </Row>
      {editing!==null && (
        <Card style={{ marginBottom:20, border:'1px solid rgba(156,39,176,.25)' }}>
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:'#fff', marginBottom:16 }}>{editing?.id?'Edit':'New'} {addLabel}</h3>
          {renderForm(form, setF, editing?.id)}
          <div style={{ display:'flex', gap:10, marginTop:12 }}>
            <Btn onClick={doSave} disabled={saving}>{saving?'Saving…':'Save'}</Btn>
            <Btn v="ghost" onClick={()=>setEditing(null)}>Cancel</Btn>
          </div>
        </Card>
      )}
      {loading
        ? [1,2,3].map(i=><div key={i} style={{ height:60, background:'rgba(255,255,255,.04)', borderRadius:10, marginBottom:8 }}/>)
        : items.map(item=>(
          <Card key={item.id} style={{ marginBottom:8 }}>
            {renderRow(item, ()=>openEdit(item), ()=>del(item.id), toggle)}
          </Card>
        ))
      }
      {!loading && items.length===0 && (
        <div style={{ textAlign:'center', padding:40, border:'1px dashed rgba(255,255,255,.08)', borderRadius:12, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,.3)' }}>
          No {addLabel.toLowerCase()}s yet. Click "+ {addLabel}" to add one.
        </div>
      )}
    </div>
  );
}

/* ═══════════ PANELS ══════════════════════ */

const HeroPanel = () => (
  <SinglePanel table="hero" title="Hero Section">
    {(d,s) => (
      <>
        <G2><F label="Greeting" value={d.greeting} onChange={s('greeting')}/><F label="Name" value={d.name} onChange={s('name')}/></G2>
        <F label="Tagline" value={d.tagline} onChange={s('tagline')}/>
        <F label="CTA Button Label" value={d.cta_label} onChange={s('cta_label')}/>
        <ImageUpload label="Profile Image" value={d.profile_image} onChange={s('profile_image')} folder="profile"/>
      </>
    )}
  </SinglePanel>
);

const AboutPanel = () => (
  <SinglePanel table="about" title="About Section">
    {(d,s) => (
      <>
        <G2><F label="Name" value={d.name} onChange={s('name')}/><F label="Headline" value={d.headline} onChange={s('headline')}/></G2>
        <F label="Subtitle" value={d.subtitle} onChange={s('subtitle')}/>
        <F label="Bio Lines (pipe-separated: Line 1|Line 2|Line 3)" value={Array.isArray(d.content)?d.content.join('|'):d.content} onChange={(v:string)=>s('content')(v.split('|').map((x:string)=>x.trim()))} rows={3} placeholder="Line 1|Line 2|Line 3"/>
        <F label="Skills (comma-separated)" value={Array.isArray(d.skills)?d.skills.join(', '):d.skills} onChange={(v:string)=>s('skills')(v.split(',').map((x:string)=>x.trim()))}/>
        <F label="Resume Link" value={d.resume_link} onChange={s('resume_link')}/>
        <ImageUpload label="Profile Image" value={d.profile_image} onChange={s('profile_image')} folder="profile"/>
      </>
    )}
  </SinglePanel>
);

const SkillsPanel = () => (
  <ListPanel table="skills" title="Skills" addLabel="Skill"
    emptyForm={{ category:'', name:'', level:80, visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <G2>
        <F label="Category" value={f.category} onChange={s('category')} placeholder="e.g. Design Tools"/>
        <F label="Skill Name" value={f.name} onChange={s('name')}/>
        <F label="Level (0–100)" value={String(f.level||80)} onChange={(v:string)=>s('level')(Number(v))} type="number"/>
        <F label="Sort Order" value={String(f.sort_order||0)} onChange={(v:string)=>s('sort_order')(Number(v))} type="number"/>
        <div style={{ gridColumn:'span 2' }}><Toggle label="Visible" value={f.visible} onChange={s('visible')}/></div>
      </G2>
    )}
    renderRow={(item:any, onEdit:any, onDel:any, toggle:any) => (
      <Row>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ width:56, height:4, background:'rgba(255,255,255,.1)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ width:`${item.level}%`, height:'100%', background:'linear-gradient(90deg,#e040fb,#9c27b0)', borderRadius:2 }}/>
          </div>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.name}</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)' }}>{item.category} · {item.level}%</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn v={item.visible?'ghost':'success'} onClick={()=>toggle(item.id,'visible',item.visible)}>{item.visible?'Hide':'Show'}</Btn>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={onDel}>Delete</Btn>
        </div>
      </Row>
    )}
  />
);

const ProjectsPanel = () => (
  <ListPanel table="projects" title="Projects" addLabel="Project"
    emptyForm={{ client:'', sub:'', description:'', live_link:'', github_link:'', tags:'', images:[], visible:true, featured:false, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <>
        <G2>
          <F label="Client Name" value={f.client} onChange={s('client')}/>
          <F label="Subtitle / Studio" value={f.sub} onChange={s('sub')}/>
          <F label="Live Link" value={f.live_link} onChange={s('live_link')} placeholder="https://…"/>
          <F label="GitHub Link" value={f.github_link} onChange={s('github_link')}/>
          <F label="Tags (comma-separated)" value={Array.isArray(f.tags)?f.tags.join(', '):f.tags} onChange={(v:string)=>s('tags')(v.split(',').map((x:string)=>x.trim()))}/>
          <F label="Sort Order" value={String(f.sort_order||0)} onChange={(v:string)=>s('sort_order')(Number(v))} type="number"/>
        </G2>
        <F label="Description" value={f.description} onChange={s('description')} rows={2}/>
        <ImageUpload label="Cover Image" value={Array.isArray(f.images)?f.images[0]:''} onChange={(url:string)=>s('images')([url])} folder="projects"/>
        <div style={{ display:'flex', gap:24 }}><Toggle label="Visible" value={f.visible} onChange={s('visible')}/><Toggle label="Featured" value={f.featured} onChange={s('featured')}/></div>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any, toggle:any) => (
      <Row>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {item.images?.[0] && <img src={item.images[0]} alt="" style={{ width:48, height:36, objectFit:'cover', borderRadius:6 }}/>}
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.client} <span style={{ color:'rgba(255,255,255,.4)' }}>— {item.sub}</span></div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.3)' }}>{(Array.isArray(item.tags)?item.tags:[]).slice(0,3).join(' · ')}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {item.featured && <span style={{ background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.25)', color:'#fbbf24', borderRadius:50, padding:'2px 8px', fontFamily:"'DM Sans',sans-serif", fontSize:9 }}>FEATURED</span>}
          <span style={{ background:item.visible?'rgba(74,222,128,.1)':'rgba(248,113,113,.1)', border:`1px solid ${item.visible?'rgba(74,222,128,.25)':'rgba(248,113,113,.25)'}`, color:item.visible?'#4ade80':'#f87171', borderRadius:50, padding:'2px 8px', fontFamily:"'DM Sans',sans-serif", fontSize:9 }}>{item.visible?'VISIBLE':'HIDDEN'}</span>
          <Btn v="ghost" onClick={()=>toggle(item.id,'visible',item.visible)}>Toggle</Btn>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={onDel}>Delete</Btn>
        </div>
      </Row>
    )}
  />
);

const ServicesPanel = () => (
  <ListPanel table="services" title="Services" addLabel="Service"
    emptyForm={{ title:'', description:'', tags:'', visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <>
        <F label="Title" value={f.title} onChange={s('title')}/>
        <F label="Description" value={f.description} onChange={s('description')} rows={2}/>
        <F label="Tags (comma-separated)" value={Array.isArray(f.tags)?f.tags.join(', '):f.tags} onChange={(v:string)=>s('tags')(v.split(',').map((x:string)=>x.trim()))}/>
        <Toggle label="Visible" value={f.visible} onChange={s('visible')}/>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any) => (
      <Row>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.title}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)' }}>{(Array.isArray(item.tags)?item.tags:[]).join(' · ')}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}><Btn v="ghost" onClick={onEdit}>Edit</Btn><Btn v="danger" onClick={onDel}>Delete</Btn></div>
      </Row>
    )}
  />
);

const ExperiencePanel = () => (
  <ListPanel table="experiences" title="Experience" addLabel="Position"
    emptyForm={{ company:'', role:'', start_date:'', end_date:'', current:false, description:'', visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <>
        <G2>
          <F label="Company" value={f.company} onChange={s('company')}/>
          <F label="Role" value={f.role} onChange={s('role')}/>
          <F label="Start Date" value={f.start_date} onChange={s('start_date')} placeholder="Jan 2022"/>
          <F label="End Date" value={f.end_date} onChange={s('end_date')} placeholder="Leave blank if current"/>
        </G2>
        <F label="Description" value={f.description} onChange={s('description')} rows={2}/>
        <div style={{ display:'flex', gap:24 }}><Toggle label="Current Role" value={f.current} onChange={s('current')}/><Toggle label="Visible" value={f.visible} onChange={s('visible')}/></div>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any) => (
      <Row>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.role} <span style={{ color:'rgba(255,255,255,.4)' }}>@ {item.company}</span></div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)' }}>{item.start_date} – {item.current?'Present':item.end_date}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}><Btn v="ghost" onClick={onEdit}>Edit</Btn><Btn v="danger" onClick={onDel}>Delete</Btn></div>
      </Row>
    )}
  />
);

const EducationPanel = () => (
  <ListPanel table="education" title="Education" addLabel="Education"
    emptyForm={{ institution:'', degree:'', field:'', start_year:'', end_year:'', grade:'', description:'', visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <G2>
        <F label="Institution" value={f.institution} onChange={s('institution')}/>
        <F label="Degree" value={f.degree} onChange={s('degree')}/>
        <F label="Field of Study" value={f.field} onChange={s('field')}/>
        <F label="Grade" value={f.grade} onChange={s('grade')}/>
        <F label="Start Year" value={String(f.start_year||'')} onChange={(v:string)=>s('start_year')(Number(v))} type="number"/>
        <F label="End Year" value={String(f.end_year||'')} onChange={(v:string)=>s('end_year')(Number(v))} type="number"/>
        <div style={{ gridColumn:'span 2' }}><F label="Description" value={f.description} onChange={s('description')} rows={2}/></div>
      </G2>
    )}
    renderRow={(item:any, onEdit:any, onDel:any) => (
      <Row>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.degree} — {item.field}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)' }}>{item.institution} · {item.start_year}–{item.end_year}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}><Btn v="ghost" onClick={onEdit}>Edit</Btn><Btn v="danger" onClick={onDel}>Delete</Btn></div>
      </Row>
    )}
  />
);

const CertsPanel = () => (
  <ListPanel table="certifications" title="Certifications & Awards" addLabel="Certificate"
    emptyForm={{ title:'', issuer:'', date:'', description:'', credential_url:'', category:'Design', featured:false, image:'', visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <>
        <G2>
          <F label="Title" value={f.title} onChange={s('title')}/>
          <F label="Issuer" value={f.issuer} onChange={s('issuer')}/>
          <F label="Date" value={f.date} onChange={s('date')} placeholder="Mar 2024"/>
          <Sel label="Category" value={f.category} onChange={s('category')} options={['Design','UX','Dev','3D','Motion','Cloud','Other']}/>
          <F label="Credential URL" value={f.credential_url} onChange={s('credential_url')} placeholder="https://…"/>
        </G2>
        <F label="Description" value={f.description} onChange={s('description')} rows={2}/>
        <ImageUpload label="Certificate Image" value={f.image} onChange={s('image')} folder="certifications"/>
        <div style={{ display:'flex', gap:24 }}><Toggle label="Featured" value={f.featured} onChange={s('featured')}/><Toggle label="Visible" value={f.visible} onChange={s('visible')}/></div>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any, toggle:any) => (
      <Row>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {item.image && <img src={item.image} alt="" style={{ width:40, height:30, objectFit:'cover', borderRadius:5 }}/>}
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.title}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)' }}>{item.issuer} · {item.date}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {item.featured && <span style={{ background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.25)', color:'#fbbf24', borderRadius:50, padding:'2px 8px', fontFamily:"'DM Sans',sans-serif", fontSize:9 }}>FEATURED</span>}
          <Btn v="ghost" onClick={()=>toggle(item.id,'visible',item.visible)}>{item.visible?'Hide':'Show'}</Btn>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={onDel}>Delete</Btn>
        </div>
      </Row>
    )}
  />
);

const ResumePanel = () => (
  <SinglePanel table="resume" title="Resume Management">
    {(d,s) => (
      <>
        <F label="Version Label" value={d.version} onChange={s('version')} placeholder="January 2025"/>
        <F label="File Name" value={d.file_name} onChange={s('file_name')} placeholder="Nirbhava_Sawant_CV.pdf"/>
        <div style={{ marginBottom:13 }}>
          <label style={lbl}>Upload PDF Resume</label>
          <div style={{ border:'2px dashed rgba(255,255,255,.12)', borderRadius:10, padding:'20px 16px', textAlign:'center', cursor:'pointer' }}
            onClick={()=>document.getElementById('pdf-inp')?.click()}>
            <div style={{ fontSize:22, marginBottom:6 }}>📄</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,.45)' }}>Click to upload PDF</div>
            <input id="pdf-inp" type="file" accept=".pdf" style={{ display:'none' }} onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return;
              const path = `resume/${Date.now()}-${file.name}`;
              const { data, error } = await supabase.storage.from('portfolio').upload(path, file, { upsert:true });
              if (!error && data) {
                const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(data.path);
                s('file_url')(publicUrl); s('file_name')(file.name);
              }
            }}/>
          </div>
          {d.file_url && <div style={{ marginTop:8, fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#4ade80' }}>✓ {d.file_name} <a href={d.file_url} target="_blank" rel="noreferrer" style={{ color:'rgba(224,64,251,.8)', marginLeft:8 }}>Preview ↗</a></div>}
        </div>
        <Toggle label="Active (visible on site)" value={d.active} onChange={s('active')}/>
        <div style={{ marginTop:12, padding:14, background:'rgba(156,39,176,.06)', border:'1px solid rgba(156,39,176,.15)', borderRadius:10 }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,.45)', lineHeight:1.6 }}>
            💡 <strong style={{ color:'rgba(255,255,255,.65)' }}>Tip:</strong> Upload PDF above, or go to Supabase → Storage → portfolio → resume folder to upload and paste the public URL.
          </p>
        </div>
      </>
    )}
  </SinglePanel>
);

const TestimonialsPanel = () => (
  <ListPanel table="testimonials" title="Testimonials" addLabel="Testimonial"
    emptyForm={{ name:'', role:'', company:'', content:'', rating:5, featured:false, visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <>
        <G2>
          <F label="Name" value={f.name} onChange={s('name')}/>
          <F label="Role" value={f.role} onChange={s('role')}/>
          <F label="Company" value={f.company} onChange={s('company')}/>
          <Sel label="Rating" value={String(f.rating||5)} onChange={(v:string)=>s('rating')(Number(v))} options={['5','4','3','2','1']}/>
        </G2>
        <F label="Review Content" value={f.content} onChange={s('content')} rows={3}/>
        <div style={{ display:'flex', gap:24 }}><Toggle label="Featured" value={f.featured} onChange={s('featured')}/><Toggle label="Visible" value={f.visible} onChange={s('visible')}/></div>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any) => (
      <Row>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.name} <span style={{ color:'rgba(255,255,255,.4)' }}>— {item.company}</span></div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)', maxWidth:480, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>"{item.content}"</div>
        </div>
        <div style={{ display:'flex', gap:8 }}><Btn v="ghost" onClick={onEdit}>Edit</Btn><Btn v="danger" onClick={onDel}>Delete</Btn></div>
      </Row>
    )}
  />
);

const SocialPanel = () => (
  <ListPanel table="social_links" title="Social Links" addLabel="Link"
    emptyForm={{ platform:'Instagram', url:'', visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <>
        <Sel label="Platform" value={f.platform} onChange={s('platform')} options={['Instagram','Twitter','LinkedIn','GitHub','Behance','Dribbble','YouTube','TikTok','Website']}/>
        <F label="URL" value={f.url} onChange={s('url')} placeholder="https://…"/>
        <Toggle label="Visible" value={f.visible} onChange={s('visible')}/>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any, toggle:any) => (
      <Row>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff' }}>{item.platform} <span style={{ color:'rgba(255,255,255,.35)', fontSize:11 }}>{item.url}</span></div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn v={item.visible?'ghost':'success'} onClick={()=>toggle(item.id,'visible',item.visible)}>{item.visible?'Hide':'Show'}</Btn>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={onDel}>Delete</Btn>
        </div>
      </Row>
    )}
  />
);

function ContactsPanel() {
  const { items, loading, load } = useCRUD('contacts');
  const unread = items.filter((m:any) => !m.read).length;
  const markRead = async (id: string) => { await supabase.from('contacts').update({ read:true }).eq('id', id); load(); };
  return (
    <div>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, color:'#fff', marginBottom:6 }}>Messages</h2>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,.4)', marginBottom:24 }}>{unread} unread · {items.length} total</p>
      {loading ? [1,2,3].map(i=><div key={i} style={{ height:80, background:'rgba(255,255,255,.04)', borderRadius:10, marginBottom:8 }}/>) :
        items.length===0
          ? <div style={{ textAlign:'center', padding:48, border:'1px dashed rgba(255,255,255,.08)', borderRadius:14, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'rgba(255,255,255,.3)' }}>No messages yet</div>
          : items.map((m:any) => (
            <Card key={m.id} style={{ marginBottom:10, borderColor:m.read?'rgba(255,255,255,.06)':'rgba(156,39,176,.25)' }}>
              <Row style={{ marginBottom:8 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  {!m.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'#e040fb', flexShrink:0 }}/>}
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{m.name}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,.4)' }}>{m.email}</span>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'rgba(255,255,255,.25)' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                  {!m.read && <Btn v="ghost" onClick={()=>markRead(m.id)}>Mark read</Btn>}
                </div>
              </Row>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,.5)', lineHeight:1.65 }}>{m.message}</p>
            </Card>
          ))
      }
    </div>
  );
}

const BlogPanel = () => (
  <ListPanel table="blog_posts" title="Blog Posts" addLabel="Post"
    emptyForm={{ title:'', slug:'', excerpt:'', content:'', tags:'', cover_image:'', published:false }}
    renderForm={(f:any, s:any) => (
      <>
        <G2>
          <F label="Title" value={f.title} onChange={s('title')}/>
          <F label="Slug" value={f.slug} onChange={s('slug')} placeholder="my-post-slug"/>
        </G2>
        <F label="Excerpt" value={f.excerpt} onChange={s('excerpt')} rows={2}/>
        <F label="Content (Markdown)" value={f.content} onChange={s('content')} rows={6}/>
        <F label="Tags (comma-separated)" value={Array.isArray(f.tags)?f.tags.join(', '):f.tags} onChange={(v:string)=>s('tags')(v.split(',').map((x:string)=>x.trim()))}/>
        <ImageUpload label="Cover Image" value={f.cover_image} onChange={s('cover_image')} folder="blog"/>
        <Toggle label="Published" value={f.published} onChange={s('published')}/>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any, toggle:any) => (
      <Row>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {item.cover_image && <img src={item.cover_image} alt="" style={{ width:48, height:36, objectFit:'cover', borderRadius:6 }}/>}
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.title}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)' }}>{item.slug}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ background:item.published?'rgba(74,222,128,.1)':'rgba(255,255,255,.05)', border:`1px solid ${item.published?'rgba(74,222,128,.25)':'rgba(255,255,255,.1)'}`, color:item.published?'#4ade80':'rgba(255,255,255,.4)', borderRadius:50, padding:'2px 8px', fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:'.1em' }}>{item.published?'PUBLISHED':'DRAFT'}</span>
          <Btn v="ghost" onClick={()=>toggle(item.id,'published',item.published)}>Toggle</Btn>
          <Btn v="ghost" onClick={onEdit}>Edit</Btn>
          <Btn v="danger" onClick={onDel}>Delete</Btn>
        </div>
      </Row>
    )}
  />
);

const GalleryPanel = () => (
  <ListPanel table="gallery" title="Gallery" addLabel="Image"
    emptyForm={{ title:'', image:'', category:'General', visible:true, sort_order:0 }}
    renderForm={(f:any, s:any) => (
      <>
        <G2><F label="Title" value={f.title} onChange={s('title')}/><F label="Category" value={f.category} onChange={s('category')}/></G2>
        <ImageUpload label="Image" value={f.image} onChange={s('image')} folder="gallery"/>
        <Toggle label="Visible" value={f.visible} onChange={s('visible')}/>
      </>
    )}
    renderRow={(item:any, onEdit:any, onDel:any) => (
      <Row>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {item.image && <img src={item.image} alt="" style={{ width:48, height:36, objectFit:'cover', borderRadius:6 }}/>}
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#fff', fontWeight:500 }}>{item.title||'Untitled'}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.35)' }}>{item.category}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}><Btn v="ghost" onClick={onEdit}>Edit</Btn><Btn v="danger" onClick={onDel}>Delete</Btn></div>
      </Row>
    )}
  />
);

const SettingsPanel = () => (
  <SinglePanel table="site_settings" title="Site Settings & SEO">
    {(d,s) => (
      <>
        <G2>
          <F label="Site Title" value={d.site_title} onChange={s('site_title')}/>
          <F label="Contact Email" value={d.contact_email} onChange={s('contact_email')}/>
          <F label="Contact Phone" value={d.contact_phone} onChange={s('contact_phone')}/>
          <F label="Google Analytics ID" value={d.google_analytics_id} onChange={s('google_analytics_id')} placeholder="G-XXXXXXXXXX"/>
          <F label="Footer Text" value={d.footer_text} onChange={s('footer_text')}/>
          <F label="OG Image URL" value={d.og_image} onChange={s('og_image')}/>
        </G2>
        <F label="Meta Description" value={d.meta_description} onChange={s('meta_description')} rows={2}/>
      </>
    )}
  </SinglePanel>
);

function OverviewPanel({ setTab }: { setTab:(t:Tab)=>void }) {
  const sections = [
    {tab:'hero' as Tab,icon:'◐',label:'Hero',desc:'Name, tagline, profile image'},
    {tab:'about' as Tab,icon:'◎',label:'About',desc:'Bio, skills, resume link'},
    {tab:'skills' as Tab,icon:'◈',label:'Skills',desc:'Skill levels by category'},
    {tab:'projects' as Tab,icon:'⬡',label:'Projects',desc:'Portfolio work items'},
    {tab:'services' as Tab,icon:'◇',label:'Services',desc:'Offered design services'},
    {tab:'experience' as Tab,icon:'◉',label:'Experience',desc:'Work history timeline'},
    {tab:'education' as Tab,icon:'◎',label:'Education',desc:'Academic background'},
    {tab:'certifications' as Tab,icon:'★',label:'Certifications',desc:'Certs & awards'},
    {tab:'resume' as Tab,icon:'◫',label:'Resume',desc:'CV upload & management'},
    {tab:'testimonials' as Tab,icon:'❝',label:'Testimonials',desc:'Client reviews'},
    {tab:'social' as Tab,icon:'◇',label:'Social Links',desc:'Social media platforms'},
    {tab:'contacts' as Tab,icon:'◉',label:'Messages',desc:'Contact form submissions'},
    {tab:'blog' as Tab,icon:'◈',label:'Blog',desc:'Posts & articles'},
    {tab:'gallery' as Tab,icon:'⬡',label:'Gallery',desc:'Image gallery'},
    {tab:'settings' as Tab,icon:'◍',label:'Settings',desc:'SEO & site configuration'},
  ];
  return (
    <div>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, color:'#fff', marginBottom:8 }}>Dashboard</h2>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,.4)', marginBottom:28 }}>Manage your entire portfolio from one place. All changes update the live site instantly.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(160px,22vw,200px),1fr))', gap:10 }}>
        {sections.map(sec => (
          <button key={sec.tab} onClick={()=>setTab(sec.tab)}
            style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'16px 14px', cursor:'pointer', textAlign:'left', transition:'all .25s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(156,39,176,.4)';e.currentTarget.style.background='rgba(156,39,176,.08)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.background='rgba(255,255,255,.03)';}}>
            <div style={{ fontSize:20, marginBottom:8 }}>{sec.icon}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:'#fff', letterSpacing:'.04em', marginBottom:3 }}>{sec.label}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.32)', lineHeight:1.4 }}>{sec.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const GROUPS = [
  {label:'Content',items:[{id:'overview',icon:'⊞',label:'Overview'},{id:'hero',icon:'◐',label:'Hero'},{id:'about',icon:'◎',label:'About'},{id:'skills',icon:'◈',label:'Skills'}]},
  {label:'Portfolio',items:[{id:'projects',icon:'⬡',label:'Projects'},{id:'services',icon:'◇',label:'Services'},{id:'experience',icon:'◉',label:'Experience'},{id:'education',icon:'◎',label:'Education'},{id:'certifications',icon:'★',label:'Certifications'},{id:'resume',icon:'◫',label:'Resume'}]},
  {label:'Social',items:[{id:'testimonials',icon:'❝',label:'Testimonials'},{id:'social',icon:'◇',label:'Social Links'},{id:'contacts',icon:'◉',label:'Messages'},{id:'blog',icon:'◈',label:'Blog'},{id:'gallery',icon:'⬡',label:'Gallery'}]},
  {label:'Config',items:[{id:'settings',icon:'◍',label:'Settings'}]},
];

function Sidebar({ active, setActive, onSignOut }: any) {
  return (
    <aside style={{ width:210, background:'rgba(255,255,255,.02)', borderRight:'1px solid rgba(255,255,255,.06)', display:'flex', flexDirection:'column', minHeight:'100vh', flexShrink:0 }}>
      <div style={{ padding:'22px 18px 16px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:'.08em', color:'#fff' }}>NS Admin</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'rgba(255,255,255,.28)', marginTop:2 }}>Portfolio CMS v4</div>
      </div>
      <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
        {GROUPS.map(g => (
          <div key={g.label} style={{ marginBottom:10 }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:600, letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(255,255,255,.18)', padding:'4px 10px', marginBottom:3 }}>{g.label}</div>
            {g.items.map((item:any) => (
              <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:7, fontFamily:"'DM Sans',sans-serif", fontSize:12, color:active===item.id?'#fff':'rgba(255,255,255,.38)', background:active===item.id?'rgba(156,39,176,.18)':'transparent', border:active===item.id?'1px solid rgba(156,39,176,.3)':'1px solid transparent', transition:'all .2s', marginBottom:2, cursor:'pointer', textAlign:'left' }}>
                <span style={{ fontSize:12 }}>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', flexDirection:'column', gap:5 }}>
        <a href="/" target="_blank" style={{ display:'block', padding:'8px 10px', borderRadius:7, fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'rgba(255,255,255,.3)', textDecoration:'none', transition:'color .2s' }}
          onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,.65)')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.3)')}>← View Live Site ↗</a>
        <button onClick={onSignOut} style={{ width:'100%', padding:'8px 10px', borderRadius:7, background:'transparent', border:'1px solid rgba(255,255,255,.08)', color:'rgba(255,255,255,.45)', fontFamily:"'DM Sans',sans-serif", fontSize:11, cursor:'pointer', textAlign:'left', transition:'all .2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.color='#fff';}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,.45)';}}>Sign Out</button>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [user, setUser] = useState<any>(null);

  useEffect(() => { getUser().then(u => { if (!u) router.push('/admin/login'); else setUser(u); }); }, [router]);

  if (!user) return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:'rgba(255,255,255,.3)' }}>Verifying…</span>
    </div>
  );

  const panels: Record<Tab, React.ReactNode> = {
    overview:<OverviewPanel setTab={setTab}/>, hero:<HeroPanel/>, about:<AboutPanel/>,
    skills:<SkillsPanel/>, projects:<ProjectsPanel/>, services:<ServicesPanel/>,
    experience:<ExperiencePanel/>, education:<EducationPanel/>, certifications:<CertsPanel/>,
    resume:<ResumePanel/>, testimonials:<TestimonialsPanel/>, social:<SocialPanel/>,
    contacts:<ContactsPanel/>, blog:<BlogPanel/>, gallery:<GalleryPanel/>, settings:<SettingsPanel/>,
  };

  return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex' }}>
      <Sidebar active={tab} setActive={setTab} onSignOut={async()=>{ await signOut(); router.push('/admin/login'); }}/>
      <main style={{ flex:1, padding:'clamp(24px,4vw,40px) clamp(20px,4vw,40px)', overflowY:'auto', maxHeight:'100vh' }}>
        <div style={{ maxWidth:900 }}>{panels[tab]}</div>
      </main>
    </div>
  );
}
