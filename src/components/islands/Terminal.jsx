/* Terminal.jsx — interactive emulated terminal */

import React, { useState, useRef, useEffect } from 'react';
import { getLang, onLangChange } from '../../lib/i18n.js';

const T_TERM = {
  en: {
    heading: 'Terminal',
    label: 'Interactive CLI',
    hint: 'Click a command to execute',
  },
  es: {
    heading: 'Terminal',
    label: 'CLI Interactivo',
    hint: 'Haz clic en un comando para ejecutarlo',
  },
};

const COMMANDS = {
  'cat projects.md': [
    '# Projects',
    '',
    '## AWS CloudOps Private EC2 Operations Platform',
    '   tags: AWS, EC2, SSM, CloudWatch, Bash',
    '   status: active · featured',
    '',
    '## Kubernetes Homelab Platform',
    '   tags: Kubernetes, k3s, Terraform, Proxmox',
    '   status: active',
    '',
    '## AWS CloudWatch Observability Stack',
    '   tags: CloudWatch, AWS, Terraform, Bash',
    '   status: active',
  ],
  'ls runbooks/': [
    'drwxr-xr-x  ec2-ssm-unreachable.md    [P2] [stable]',
    'drwxr-xr-x  k8s-node-notready.md      [P3] [stable]',
  ],
  'whoami': [
    'elvis.gross',
    'roles: cloudops-engineer, platform-engineer, sre',
    'cloud: aws, gcp',
    'status: available-for-new-roles',
    'location: remote',
  ],
};

export default function Terminal() {
  const [lang, setLang] = useState(getLang());
  useEffect(() => onLangChange(setLang), []);

  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(null);
  const outputRef = useRef(null);

  const run = (cmd) => {
    if (running) return;
    setRunning(cmd);
    const lines = COMMANDS[cmd] || ['command not found'];
    let i = 0;
    const id = setInterval(() => {
      setHistory(h => [...h, { cmd: i === 0 ? cmd : null, line: lines[i] }]);
      i++;
      if (i >= lines.length) {
        clearInterval(id);
        setRunning(null);
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
          }
        }, 30);
      }
    }, 55);
  };

  const clear = () => setHistory([]);

  return (
    <section style={{
      background: 'var(--bg-subtle)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: 'var(--content-gap) clamp(20px,4vw,48px)',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div className="fade-in" style={{
          background: '#0b0b0b',
          border: '1px solid #1f1f1f',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-dark-md)',
        }}>
          {/* Window chrome */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderBottom: '1px solid #1f1f1f',
            background: '#111111',
          }}>
            <span style={{ width:11,height:11,borderRadius:'50%',background:'#3a3a3a',display:'inline-block'}}/>
            <span style={{ width:11,height:11,borderRadius:'50%',background:'#3a3a3a',display:'inline-block'}}/>
            <span style={{ width:11,height:11,borderRadius:'50%',background:'#3a3a3a',display:'inline-block'}}/>
            <span style={{ flex:1, textAlign:'center', fontFamily:'var(--font-mono)', fontSize:11, color:'#6b6b6b', letterSpacing:'0.06em' }}>
              elvis@ops:~
            </span>
            <button onClick={clear} style={{
              fontFamily:'var(--font-mono)', fontSize:10, color:'#6b6b6b',
              background:'transparent', border:'none', cursor:'pointer',
              letterSpacing:'0.06em', textTransform:'uppercase',
              transition:'color var(--duration-fast) var(--ease-default)',
            }}
            onMouseEnter={e=>e.currentTarget.style.color='#9a9a9a'}
            onMouseLeave={e=>e.currentTarget.style.color='#6b6b6b'}>
              clear
            </button>
          </div>

          {/* Command buttons */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid #1f1f1f',
            display: 'flex', gap: 8, flexWrap: 'wrap',
          }}>
            {Object.keys(COMMANDS).map(cmd => (
              <button key={cmd} onClick={() => run(cmd)} disabled={!!running} style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
                color: running ? '#3a3a3a' : '#9a9a9a',
                background: '#161616', border: '1px solid #2a2a2a',
                borderRadius: 'var(--radius-sm)', padding: '5px 12px',
                cursor: running ? 'not-allowed' : 'pointer',
                transition: 'color var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default)',
              }}
              onMouseEnter={e=>{ if(!running){e.currentTarget.style.color='#f2f2f2';e.currentTarget.style.borderColor='#3a3a3a';}}}
              onMouseLeave={e=>{ e.currentTarget.style.color=running?'#3a3a3a':'#9a9a9a';e.currentTarget.style.borderColor='#2a2a2a';}}>
                $ {cmd}
              </button>
            ))}
          </div>

          {/* Output */}
          <div ref={outputRef} style={{
            padding: '16px 20px', minHeight: 160, maxHeight: 280,
            overflowY: 'auto', fontFamily: 'var(--font-mono)',
            fontSize: 13, lineHeight: 1.75, color: '#9a9a9a',
          }}>
            {history.length === 0 ? (
              <span style={{ color: '#3a3a3a' }}>
                {lang === 'en' ? '// click a command above to execute' : '// haz clic en un comando para ejecutar'}
              </span>
            ) : (
              history.map((item, i) => (
                <div key={i}>
                  {item.cmd && (
                    <div style={{ marginTop: i > 0 ? 8 : 0 }}>
                      <span style={{ color: '#6b6b6b' }}>elvis@ops:~$ </span>
                      <span style={{ color: '#f2f2f2' }}>{item.cmd}</span>
                    </div>
                  )}
                  {item.line !== undefined && (
                    <div style={{ color: item.line === '' ? undefined : '#9a9a9a', paddingLeft: item.cmd ? 0 : '2ch' }}>
                      {item.line || ' '}
                    </div>
                  )}
                </div>
              ))
            )}
            {/* Idle prompt */}
            {!running && (
              <div style={{ marginTop: history.length ? 8 : 0 }}>
                <span style={{ color: '#6b6b6b' }}>elvis@ops:~$ </span>
                <span style={{ borderLeft: '2px solid #6b6b6b', animation: 'blink-cursor 1s step-end infinite' }}>&nbsp;</span>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes blink-cursor{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      </div>
    </section>
  );
}
