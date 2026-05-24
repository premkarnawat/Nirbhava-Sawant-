'use client';
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Props { value?: string; onChange: (url: string) => void; bucket?: string; folder?: string; label?: string; }

export default function ImageUpload({ value, onChange, bucket='portfolio', folder='uploads', label='Image' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string|null>(value||null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5*1024*1024) { setError('File must be under 5MB.'); return; }
    setError(''); setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const ext = file.name.split('.').pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
      onChange(publicUrl); setPreview(publicUrl);
    } catch (e: any) { setError(e.message||'Upload failed'); setPreview(value||null); }
    finally { setUploading(false); }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) upload(f);
  }, []);

  const clear = () => { setPreview(null); onChange(''); if (inputRef.current) inputRef.current.value=''; };

  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', marginBottom:6, display:'block' }}>{label}</label>
      {preview ? (
        <div style={{ position:'relative', display:'inline-block' }}>
          <img src={preview} alt="Preview" style={{ width:160, height:120, objectFit:'cover', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', display:'block' }} />
          {uploading && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#fff' }}>Uploading…</div>}
          <button onClick={clear} style={{ position:'absolute', top:-8, right:-8, width:22, height:22, borderRadius:'50%', background:'#ef4444', border:'none', color:'#fff', fontSize:13, cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>×</button>
        </div>
      ) : (
        <div onClick={()=>inputRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={onDrop}
          style={{ border:`2px dashed ${dragging?'rgba(156,39,176,0.7)':'rgba(255,255,255,0.12)'}`, borderRadius:10, padding:'22px 16px', textAlign:'center', cursor:'pointer', background:dragging?'rgba(156,39,176,0.06)':'rgba(255,255,255,0.02)', transition:'all .25s' }}>
          <div style={{ fontSize:24, marginBottom:6 }}>📁</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,.5)', marginBottom:3 }}>Drop image or <span style={{ color:'rgba(224,64,251,0.8)' }}>browse</span></div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'rgba(255,255,255,.25)' }}>PNG, JPG, WEBP · Max 5MB</div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f);}} style={{ display:'none' }} />
      {error && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#f87171', marginTop:5 }}>{error}</div>}
      <input type="text" placeholder="Or paste image URL…" value={!preview||(preview===value)?(value||''):''} onChange={e=>{onChange(e.target.value);setPreview(e.target.value);}}
        style={{ width:'100%', marginTop:7, background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:7, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:12, padding:'8px 12px', outline:'none' }}
        onFocus={e=>e.target.style.borderColor='rgba(156,39,176,.5)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,.07)'}/>
    </div>
  );
}
