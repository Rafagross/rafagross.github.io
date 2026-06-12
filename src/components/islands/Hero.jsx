/* Hero.jsx — DS Hero island, monochrome cloud icon */

import React, { useRef, useEffect, useState } from 'react';
import { getLang, onLangChange } from '../../lib/i18n.js';

const T_HERO = {
  en: {
    available: 'Available for new roles',
    roles: ['CloudOps Engineer', 'Platform Engineer', 'SRE'],
    name: ['Elvis Rafael', 'Gross'],
    pitch: 'I build and operate cloud infrastructure at scale — AWS EC2 fleets, Kubernetes platforms, hybrid architectures, and the observability that keeps them running.',
    cta1: 'View Projects', cta2: 'Resume ↗', tagline: 'Stack',
  },
  es: {
    available: 'Disponible para nuevas oportunidades',
    roles: ['Ingeniero CloudOps', 'Ingeniero de Plataforma', 'SRE'],
    name: ['Elvis Rafael', 'Gross'],
    pitch: 'Construyo y opero infraestructura cloud a escala — flotas EC2 de AWS, plataformas Kubernetes, arquitecturas híbridas y la observabilidad que las mantiene en marcha.',
    cta1: 'Ver Proyectos', cta2: 'Currículum ↗', tagline: 'Stack',
  },
};
const STACK = ['AWS','GCP','Terraform','Kubernetes','Golden AMI Pipelines','CloudWatch','Bash','AWS Systems Manager','AWS CLI','Patch Management'];

/* =================================================================
   FlowFieldCanvas — white-only particles, slow speed
   ================================================================= */
function FlowFieldCanvas() {
  const canvasRef = useRef(null);
  useEffect(function() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, raf;
    const N=180, LIFE=200, SPD=0.55, FFS=0.0032;
    let particles = [];

    function resize() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width  = Math.round(W*dpr);
      canvas.height = Math.round(H*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      particles = [];
      for (let i=0;i<N;i++) particles.push({
        x: Math.random()*W, y: Math.random()*H,
        age: Math.floor(Math.random()*LIFE),
      });
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas); resize();

    let t = 0;
    function frame() {
      const dark  = document.documentElement.getAttribute('data-theme')==='dark';
      const bgRgb = dark ? '11,11,11' : '255,255,255';
      const pMax  = dark ? 0.22 : 0.09;

      ctx.fillStyle = 'rgba('+bgRgb+',0.04)';
      ctx.fillRect(0,0,W,H);

      ctx.lineWidth = 0.65;
      for (let i=0;i<particles.length;i++) {
        const p = particles[i];
        const ang = Math.sin(p.x*FFS+t*0.14)*Math.PI + Math.cos(p.y*FFS+t*0.10)*Math.PI;
        const nx=p.x+Math.cos(ang)*SPD, ny=p.y+Math.sin(ang)*SPD;
        const a = Math.min(p.age/36,(LIFE-p.age)/36,1)*pMax;
        ctx.strokeStyle = 'rgba(255,255,255,'+a+')';
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(nx,ny); ctx.stroke();
        p.x=nx; p.y=ny; p.age++;
        if (p.age>LIFE||p.x<-10||p.x>W+10||p.y<-10||p.y>H+10) {
          p.x=Math.random()*W; p.y=Math.random()*H; p.age=0;
        }
      }
      t += 0.008;
      raf = requestAnimationFrame(frame);
    }
    frame();
    return function(){ ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" style={{
      position:'absolute', inset:0, width:'100%', height:'100%',
      display:'block', pointerEvents:'none', zIndex:0,
    }}/>
  );
}

/* =================================================================
   CloudIcon — SVG cloud with JS sweep beam via strokeDashoffset
   Monochrome: gradient uses currentColor, drop-shadows are neutral gray.
   ================================================================= */
const CLOUD_COMBINED   = "M 5 13.5 A 4 4 0 0 1 7.2 6.3 A 6 6 0 0 1 18.2 8.5 A 4.5 4.5 0 0 1 17.5 17.5 M 11.5 17.5 L 5 17.5 M 14.5 17.5 L 14.51 17.5";
const CLOUD_PATHS_BASE = [
  "M 5 13.5 A 4 4 0 0 1 7.2 6.3 A 6 6 0 0 1 18.2 8.5 A 4.5 4.5 0 0 1 17.5 17.5",
  "M 11.5 17.5 L 5 17.5",
  "M 14.5 17.5 L 14.51 17.5",
];

function CloudIcon() {
  const sweepRef = useRef(null);
  const haloRef  = useRef(null);

  useEffect(function() {
    const sweep = sweepRef.current;
    const halo  = haloRef.current;
    if (!sweep) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const L       = sweep.getTotalLength();
    const dashLen = L * 0.09;        /* 9% of total = beam width */
    const dur     = 3600;            /* ms per revolution */

    sweep.style.strokeDasharray = dashLen + ' ' + (L - dashLen);
    if (halo) halo.style.strokeDasharray = (dashLen * 2.6) + ' ' + (L - dashLen * 2.6);

    let startTs = null, raf;
    function animate(ts) {
      if (!startTs) startTs = ts;
      const elapsed = (ts - startTs) % dur;
      const offset  = L * (1 - elapsed / dur);
      sweep.style.strokeDashoffset = offset;
      if (halo) halo.style.strokeDashoffset = offset + dashLen * 0.8;
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return function() { cancelAnimationFrame(raf); };
  }, []);

  return (
    <div aria-hidden="true" data-cloud style={{
      position:'absolute',
      right:'clamp(40px, 5vw, 72px)',
      top:'clamp(88px, 13vw, 148px)',
      width:252, height:252,
      animation:'cloud-float 7s ease-in-out infinite',
      zIndex:1,
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width="252" height="252"
        style={{
          overflow:'visible',
          color:'var(--text)',
          filter:'drop-shadow(0 0 7px rgba(154,154,154,0.55)) drop-shadow(0 0 14px rgba(154,154,154,0.25))',
        }}
      >
        <defs>
          <linearGradient id="cloud-grad-cb" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor"/>
            <stop offset="100%" stopColor="currentColor"/>
          </linearGradient>
        </defs>

        {/* Base monochrome outline — always visible */}
        {CLOUD_PATHS_BASE.map(function(d,i){ return (
          <path key={i} d={d}
            stroke="url(#cloud-grad-cb)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        ); })}

        {/* Soft halo ahead of the sweep — thin, neutral gray */}
        <path ref={haloRef}
          d={CLOUD_COMBINED} fill="none"
          stroke="rgba(154,154,154,0.40)" strokeWidth="1.0"
          strokeLinecap="round" strokeLinejoin="round"/>

        {/* White sweep beam — dashoffset driven by rAF */}
        <path ref={sweepRef}
          d={CLOUD_COMBINED} fill="none"
          stroke="white" strokeWidth="0.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{filter:'drop-shadow(0 0 6px rgba(255,255,255,1)) drop-shadow(0 0 2px rgba(255,255,255,0.9))'}}/>
      </svg>

      <style>{`
        @keyframes cloud-float {
          0%,100%  { transform: translateY(0px)  translateX(0px);  }
          25%      { transform: translateY(-10px) translateX(7px);  }
          50%      { transform: translateY(-14px) translateX(0px);  }
          75%      { transform: translateY(-9px)  translateX(-7px); }
        }
        @media (max-width: 680px) { [data-cloud] { display: none !important; } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes cloud-float { 0%,100%{ transform: translateY(0px); } }
        }
      `}</style>
    </div>
  );
}

/* =================================================================
   TypingCursor
   ================================================================= */
function TypingCursor({ roles }) {
  const [roleIdx, setRoleIdx]     = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping]   = useState(true);

  useEffect(function(){
    const role = roles[roleIdx];
    if(isTyping){
      if(displayed.length < role.length){
        const id = setTimeout(function(){ setDisplayed(role.slice(0, displayed.length+1)); }, 55);
        return function(){ clearTimeout(id); };
      } else {
        const id2 = setTimeout(function(){ setIsTyping(false); }, 1800);
        return function(){ clearTimeout(id2); };
      }
    } else {
      if(displayed.length > 0){
        const id3 = setTimeout(function(){ setDisplayed(displayed.slice(0,-1)); }, 30);
        return function(){ clearTimeout(id3); };
      } else {
        setRoleIdx((roleIdx+1) % roles.length);
        setIsTyping(true);
      }
    }
  }, [displayed, isTyping, roleIdx, roles]);

  return (
    <span style={{fontFamily:'var(--font-mono)',fontSize:'var(--text-lg)',color:'var(--text-muted)',fontWeight:400}}>
      {displayed}
      <span style={{borderLeft:'2px solid var(--text-muted)',marginLeft:2,animation:'hero-blink 1s step-end infinite'}}>&nbsp;</span>
    </span>
  );
}

/* =================================================================
   StatusDotInline
   ================================================================= */
function StatusDotInline({ label }) {
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:8,fontFamily:'var(--font-mono)',fontSize:'var(--text-xs)',color:'var(--text-muted)',letterSpacing:'0.04em'}}>
      <span style={{position:'relative',width:8,height:8,flexShrink:0,display:'inline-block'}}>
        <span style={{position:'absolute',inset:0,borderRadius:'50%',background:'var(--green)'}}/>
        <span style={{position:'absolute',inset:'-3px',borderRadius:'50%',background:'var(--green)',opacity:0,animation:'dot-pulse 2.4s cubic-bezier(.4,0,.6,1) infinite'}}/>
      </span>
      {label}
    </span>
  );
}

/* =================================================================
   BtnInline
   ================================================================= */
function BtnInline({ href, variant, children }) {
  const [hov, setHov] = useState(false);
  const ip = variant === 'primary';
  return (
    <a href={href} style={{display:'inline-flex',alignItems:'center',textDecoration:'none',fontFamily:'var(--font-sans)',fontSize:'var(--text-sm)',fontWeight:500,letterSpacing:'var(--tracking-tight)',padding:'9px 20px',borderRadius:'var(--radius-sm)',border:'1px solid',background:ip?(hov?'transparent':'var(--accent)'):'transparent',color:ip?(hov?'var(--text)':'var(--accent-text)'):'var(--text)',borderColor:ip?'var(--accent)':(hov?'var(--text)':'var(--border-strong)'),transition:'all var(--duration-fast) var(--ease-default)',transform:hov?'translateY(-1px)':'none'}}
      onMouseEnter={function(){setHov(true);}} onMouseLeave={function(){setHov(false);}}>
      {children}
    </a>
  );
}

/* =================================================================
   Hero — default export
   ================================================================= */
export default function Hero() {
  const [lang, setLang] = useState(getLang());
  useEffect(() => onLangChange(setLang), []);

  const t = T_HERO[lang];
  const pr = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const r0=useRef(null),r1=useRef(null),r2=useRef(null),
        r3=useRef(null),r4=useRef(null),r5=useRef(null);

  useEffect(function(){
    if(pr) return;
    const refs=[r0,r1,r2,r3,r4,r5], delays=[0,80,160,240,300,360];
    const timers = refs.map(function(ref,i){
      const el = ref.current; if(!el) return null;
      return setTimeout(function(){ if(el){ el.style.opacity='1'; el.style.transform='none'; } }, delays[i]);
    });
    return function(){ timers.forEach(function(id){ if(id) clearTimeout(id); }); };
  }, []);

  const ini = pr ? {opacity:1} : {opacity:0, transform:'translateY(22px)'};

  return (
    <section style={{position:'relative',overflow:'hidden',minHeight:'100vh',display:'flex',alignItems:'center',background:'var(--bg)'}}>
      <FlowFieldCanvas/>
      <CloudIcon/>

      <div style={{position:'relative',zIndex:2,maxWidth:'var(--max-width)',margin:'0 auto',padding:'clamp(96px,14vw,160px) clamp(20px,4vw,48px) clamp(64px,8vw,96px)',width:'100%'}}>
        <div ref={r0} style={{...ini,marginBottom:28}}>
          <StatusDotInline label={t.available}/>
        </div>
        <h1 ref={r1} style={{...ini,fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--text-display)',letterSpacing:'var(--tracking-display)',lineHeight:'var(--leading-tight)',color:'var(--text)',marginBottom:8}}>
          {t.name[0]}<br/>{t.name[1]}
        </h1>
        <div ref={r2} style={{...ini,marginBottom:28,height:36,display:'flex',alignItems:'center'}}>
          <TypingCursor roles={t.roles}/>
        </div>
        <p ref={r3} style={{...ini,maxWidth:560,color:'var(--text-muted)',fontSize:'var(--text-lg)',lineHeight:'var(--leading-relaxed)',marginBottom:40}}>
          {t.pitch}
        </p>
        <div ref={r4} style={{...ini,display:'flex',gap:12,flexWrap:'wrap',marginBottom:52}}>
          <BtnInline href="/projects" variant="primary">{t.cta1}</BtnInline>
          <BtnInline href="/resume"   variant="secondary">{t.cta2}</BtnInline>
        </div>
        <div ref={r5} style={{...ini}}>
          <p style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--text-faint)',marginBottom:12}}>{t.tagline}</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {STACK.map(function(s,i){ return (
              <span key={s} style={{fontFamily:'var(--font-mono)',fontSize:11,fontWeight:500,letterSpacing:'0.06em',textTransform:'uppercase',background:'var(--bg-subtle)',borderRadius:9999,padding:'3px 10px',lineHeight:1.5,animation:'stack-wave 4.8s ease-in-out infinite',animationDelay:i*0.21+'s',color:'var(--text-faint)',border:'1px solid var(--border)'}}>{s}</span>
            ); })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dot-pulse   { 0%,100%{opacity:0;transform:scale(1)} 50%{opacity:.35;transform:scale(2.2)} }
        @keyframes stack-wave  { 0%,55%,100%{color:var(--text-faint);border-color:var(--border)} 27%{color:var(--text);border-color:var(--border-strong)} }
        @media(prefers-reduced-motion:reduce){
          @keyframes hero-blink  { 0%,100%{opacity:1} }
          @keyframes dot-pulse   { 0%,100%{opacity:0} }
          @keyframes stack-wave  { 0%,100%{color:var(--text-muted)} }
        }
      `}</style>
    </section>
  );
}
