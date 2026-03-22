import { useEffect, useState, useRef } from "react";


export default function FloraCycleHero() {
  const [vis, setVis] = useState(false);
  const petalRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const container = petalRef.current;
    if (!container) return;
    const petals = [];
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("div");
      const size = 6 + Math.random() * 14;
      const startX = Math.random() * 100;
      const delay = Math.random() * 8;
      const dur = 7 + Math.random() * 6;
      el.style.cssText = `
        position:absolute; width:${size}px; height:${size * 1.4}px;
        left:${startX}%; bottom:-20px;
        border-radius: 60% 40% 60% 40% / 70% 30% 70% 30%;
        background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.85), rgba(200,160,230,0.45));
        animation: petalFloat ${dur}s ease-in-out ${delay}s infinite;
        pointer-events:none; filter: blur(0.5px);
      `;
      container.appendChild(el);
      petals.push(el);
    }
    return () => petals.forEach(p => p.remove());
  }, []);

  const cl = (base, cond) => `${base}${cond ? " show" : ""}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=DM+Sans:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        .fc-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          background: #faf7ff;
          position: relative;
          overflow: hidden;
        }

        .fc-bg {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0; overflow: hidden;
        }
        .fc-blob {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55;
        }
        .blob1 {
          width:700px; height:700px; top:-200px; left:-150px;
          background: radial-gradient(circle, #e4d0f8 0%, #d8c4f5 40%, transparent 70%);
          animation: blobDrift1 18s ease-in-out infinite alternate;
        }
        .blob2 {
          width:500px; height:600px; bottom:-100px; right:-100px;
          background: radial-gradient(circle, #f0e6ff 0%, #ceb8ee 50%, transparent 70%);
          animation: blobDrift2 14s ease-in-out infinite alternate;
        }
        .blob3 {
          width:400px; height:400px; top:40%; left:40%;
          background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(220,190,255,0.3) 60%, transparent 80%);
          animation: blobDrift3 20s ease-in-out infinite alternate;
        }
        @keyframes blobDrift1 { from{transform:translate(0,0) scale(1)} to{transform:translate(60px,40px) scale(1.08)} }
        @keyframes blobDrift2 { from{transform:translate(0,0) scale(1)} to{transform:translate(-40px,-50px) scale(1.12)} }
        @keyframes blobDrift3 { from{transform:translate(0,0) scale(0.9);opacity:0.3} to{transform:translate(-30px,20px) scale(1.1);opacity:0.5} }

        /* Navbar */
        .fc-nav {
          position: relative; z-index: 30;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.6rem 4.5rem;
          backdrop-filter: blur(12px);
          background: rgba(250,247,255,0.65);
          border-bottom: 1px solid rgba(180,140,220,0.12);
        }
        .fc-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 500;
          color: #2a0a40; text-decoration: none; letter-spacing: -0.01em;
        }
        .fc-logo em { font-style: italic; color: #8040b8; }
        .fc-nav-links { display:flex; gap:2.5rem; list-style:none; }
        .fc-nav-links li a {
          font-size:0.78rem; color:#7a5898; text-decoration:none;
          letter-spacing:0.12em; font-weight:400; text-transform:uppercase; transition:color 0.2s;
        }
        .fc-nav-links li a:hover { color:#5a2090; }
        .fc-nav-cta {
          font-size:0.78rem; color:#7030a8;
          border:1.5px solid rgba(112,48,168,0.28); padding:8px 20px;
          border-radius:50px; text-decoration:none; letter-spacing:0.07em;
          font-weight:500; backdrop-filter:blur(8px); background:rgba(255,255,255,0.4);
          transition:all 0.25s;
        }
        .fc-nav-cta:hover { background:rgba(112,48,168,0.08); border-color:rgba(112,48,168,0.5); }

        /* Layout */
        .fc-main {
          flex:1; display:flex; position:relative; z-index:1;
          min-height: calc(100vh - 80px);
        }

        /* LEFT — flower */
        .fc-flower-panel {
          width:50%; position:relative;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
        }
        .fc-flower-panel::after {
          content:''; position:absolute; inset:0; z-index:3; pointer-events:none;
          background:
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(250,247,255,0.2) 80%),
            linear-gradient(to right, transparent 70%, rgba(250,247,255,0.92) 100%);
        }

        .fc-petals { position:absolute; inset:0; z-index:2; overflow:hidden; }
        @keyframes petalFloat {
          0%  { transform:translateY(0) rotate(0deg) translateX(0); opacity:0; }
          10% { opacity:0.75; }
          50% { transform:translateY(-45vh) rotate(180deg) translateX(20px); opacity:0.6; }
          90% { opacity:0.2; }
          100%{ transform:translateY(-92vh) rotate(360deg) translateX(-10px); opacity:0; }
        }

        .fc-pearl-glow {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:340px; height:340px; border-radius:50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(255,255,255,0.8) 0%, rgba(220,185,255,0.4) 40%,
            rgba(190,150,240,0.12) 70%, transparent 85%
          );
          animation:pearlBreath 5s ease-in-out infinite;
          z-index:1; filter:blur(3px);
        }
        @keyframes pearlBreath {
          0%,100% { transform:translate(-50%,-50%) scale(1); opacity:0.75; }
          50%      { transform:translate(-50%,-50%) scale(1.15); opacity:1; }
        }

        .fc-glow-ring {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          border-radius:50%; border:1px solid rgba(200,160,240,0.18);
          animation:ringPulse 5s ease-in-out infinite; z-index:1;
        }
        .ring-a { width:380px; height:380px; }
        .ring-b { width:520px; height:520px; animation-delay:-1.7s; opacity:0.6; }
        .ring-c { width:660px; height:660px; animation-delay:-3.4s; opacity:0.35; border-style:dashed; }
        @keyframes ringPulse { 0%,100%{opacity:0.25} 50%{opacity:0.65} }

        .fc-shimmer-ring {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:460px; height:460px; border-radius:50%;
          border:1px solid transparent;
          background:
            linear-gradient(white,white) padding-box,
            conic-gradient(from 0deg,
              transparent 0%, rgba(200,160,240,0.5) 20%,
              transparent 40%, rgba(220,180,255,0.4) 60%,
              transparent 80%, rgba(200,160,240,0.5) 100%
            ) border-box;
          animation:shimmerSpin 12s linear infinite; z-index:2;
        }
        @keyframes shimmerSpin {
          from { transform:translate(-50%,-50%) rotate(0deg); }
          to   { transform:translate(-50%,-50%) rotate(360deg); }
        }

        .fc-flower-wrap {
          position:relative; z-index:2;
          width:420px; height:420px;
          display:flex; align-items:center; justify-content:center;
        }
        .fc-flower-img {
          width:300%; height:300%; object-fit:contain;
          filter:
            drop-shadow(0 0 45px rgba(180,120,240,0.6))
            drop-shadow(0 0 90px rgba(160,100,220,0.28))
            drop-shadow(0 24px 48px rgba(100,50,160,0.18));
          animation: flowerFloat 8s ease-in-out infinite;
          transform-origin: center bottom;
        }
        @keyframes flowerFloat {
          0%   { transform:translateY(0px) rotate(-1.5deg) scale(1); }
          25%  { transform:translateY(-10px) rotate(0deg) scale(1.012); }
          50%  { transform:translateY(-16px) rotate(1.5deg) scale(1.018); }
          75%  { transform:translateY(-6px) rotate(0.5deg) scale(1.008); }
          100% { transform:translateY(0px) rotate(-1.5deg) scale(1); }
        }

        /* Entrance for flower panel */
        .fc-flower-entrance {
          opacity:0; transform:scale(0.96);
          transition: opacity 1.3s ease 0.15s, transform 1.3s ease 0.15s;
        }
        .fc-flower-entrance.show { opacity:1; transform:scale(1); }

        /* RIGHT — content */
        .fc-content-panel {
          width:50%; display:flex; align-items:center;
          padding:4rem 5rem 4rem 3.5rem;
          position:relative; z-index:2;
        }
        .fc-content { max-width:460px; }

        .fc-fade {
          opacity:0; transform:translateX(26px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fc-fade.show { opacity:1; transform:translateX(0); }
        .d0{transition-delay:0.1s} .d1{transition-delay:0.22s}
        .d2{transition-delay:0.36s} .d3{transition-delay:0.50s}
        .d4{transition-delay:0.64s} .d5{transition-delay:0.78s}
        .d6{transition-delay:0.92s}

        .fc-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(180,130,240,0.09);
          border:1px solid rgba(180,130,240,0.2);
          border-radius:50px; padding:5px 14px 5px 8px; margin-bottom:1.8rem;
          backdrop-filter:blur(8px);
        }
        .fc-badge-dot {
          width:6px; height:6px; border-radius:50%; background:#9050c8;
          animation:dotPulse 2s ease-in-out infinite;
        }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.65)} }
        .fc-badge span {
          font-size:0.7rem; font-weight:500;
          letter-spacing:0.14em; text-transform:uppercase; color:#7030a8;
        }

        .fc-h1 {
          font-family:'Cormorant Garamond', serif;
          font-size: clamp(3.6rem, 4.8vw, 5.8rem);
          font-weight:300; line-height:0.96;
          color:#1e0535; letter-spacing:-0.03em; margin-bottom:1rem;
        }
        .fc-h1 em { display:block; font-style:italic; color:#7030a8; font-weight:400; }

        .fc-tagline {
          font-family:'Cormorant Garamond', serif;
          font-size: clamp(1rem, 1.5vw, 1.22rem);
          font-style:italic; color:#7a50a0;
          line-height:1.6; margin-bottom:1.5rem; font-weight:300;
        }

        .fc-divider {
          display:flex; align-items:center; gap:12px; margin-bottom:1.5rem;
        }
        .fc-divider-line {
          flex:1; height:1px;
          background:linear-gradient(90deg, rgba(160,100,220,0.28), transparent);
        }
        .fc-divider-dots {
          font-size:0.55rem; color:rgba(160,100,220,0.45); letter-spacing:0.3em;
        }

        .fc-mission {
          font-size:0.88rem; line-height:1.9; color:#5c4070;
          font-weight:300; margin-bottom:2rem;
        }

        .fc-tags {
          display:flex; flex-wrap:wrap; gap:8px; margin-bottom:2.2rem;
        }
        .fc-tag {
          font-size:0.71rem; color:#7030a8;
          background:rgba(180,130,240,0.07);
          border:1px solid rgba(180,130,240,0.18);
          border-radius:50px; padding:5px 13px;
          letter-spacing:0.05em; transition:all 0.2s;
        }
        .fc-tag:hover { background:rgba(180,130,240,0.14); border-color:rgba(180,130,240,0.38); }

        .fc-cta-row {
          display:flex; align-items:center; gap:1rem;
          margin-bottom:2.8rem; flex-wrap:wrap;
        }
        .fc-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 28px; border-radius:50px;
          font-family:'DM Sans',sans-serif; font-size:0.83rem;
          font-weight:500; letter-spacing:0.05em;
          cursor:pointer; border:none; transition:all 0.3s ease; white-space:nowrap;
        }
        .fc-btn-primary {
          background:linear-gradient(135deg, #6020a0 0%, #9050c8 60%, #b070e0 100%);
          color:white;
          box-shadow: 0 8px 30px rgba(96,32,160,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .fc-btn-primary:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(96,32,160,0.45); }
        .fc-btn-ghost {
          background:rgba(255,255,255,0.5); color:#7030a8;
          border:1.5px solid rgba(120,60,180,0.22); backdrop-filter:blur(8px);
        }
        .fc-btn-ghost:hover { background:rgba(180,130,240,0.08); border-color:rgba(120,60,180,0.4); }

        .fc-stats {
          display:flex; gap:0;
          border-top:1px solid rgba(160,100,220,0.12); padding-top:1.8rem;
        }
        .fc-stat { flex:1; }
        .fc-stat:not(:last-child) { padding-right:1.5rem; border-right:1px solid rgba(160,100,220,0.1); }
        .fc-stat:not(:first-child) { padding-left:1.5rem; }
        .fc-stat-num {
          display:block; font-family:'Cormorant Garamond',serif;
          font-size:2.2rem; font-weight:500; color:#5a1a90;
          line-height:1; letter-spacing:-0.04em;
        }
        .fc-stat-label {
          display:block; font-size:0.64rem; text-transform:uppercase;
          letter-spacing:0.14em; color:#9878b8; margin-top:5px; font-weight:400;
        }

        .fc-scroll-hint {
          position:absolute; bottom:2.2rem; left:50%;
          transform:translateX(-50%);
          display:flex; flex-direction:column; align-items:center;
          gap:6px; opacity:0.38; z-index:10;
        }
        .fc-scroll-hint span {
          font-size:0.58rem; letter-spacing:0.2em;
          text-transform:uppercase; color:#8050b0;
        }
        .fc-scroll-line {
          width:1px; height:30px;
          background:linear-gradient(to bottom, #9050c8, transparent);
          animation:scrollBounce 2.2s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%,100%{transform:scaleY(1) translateY(0);opacity:0.4}
          50%{transform:scaleY(0.55) translateY(4px);opacity:1}
        }

        @media (max-width:900px) {
          .fc-main { flex-direction:column-reverse; }
          .fc-flower-panel { width:100%; height:55vw; min-height:260px; }
          .fc-content-panel { width:100%; padding:2.5rem 2rem; }
          .fc-nav { padding:1.3rem 2rem; }
          .fc-nav-links { display:none; }
          .fc-flower-wrap { width:240px; height:240px; }
          .fc-shimmer-ring { width:280px; height:280px; }
          .fc-ring-a { width:260px; height:260px; }
          .fc-ring-b { width:360px; height:360px; }
          .fc-ring-c { display:none; }
          .fc-hero { overflow:auto; }
        }
      `}</style>

      <div className="fc-bg">
        <div className="fc-blob blob1" />
        <div className="fc-blob blob2" />
        <div className="fc-blob blob3" />
      </div>

      <div className="fc-hero">
        <nav className="fc-nav">
          <a href="/" className="fc-logo">Flora<em>Cycle</em></a>
          <a href="#join" className="fc-nav-cta">Explore More</a>
        </nav>

        <div className="fc-main">

          {/* LEFT — Flower */}
          <div className={`fc-flower-panel fc-flower-entrance ${vis ? "show" : ""}`}>
            <div ref={petalRef} className="fc-petals" />
            <div className="fc-pearl-glow" />
            <div className="fc-glow-ring ring-a" />
            <div className="fc-glow-ring ring-b" />
            <div className="fc-glow-ring ring-c" />
            <div className="fc-shimmer-ring" />
            <div className="fc-flower-wrap">
              <img src="\Flower.png" alt="Sacred purple rose" className="fc-flower-img" />
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="fc-content-panel">
            <div className="fc-content">

              <div className={cl("fc-badge fc-fade d0", vis)}>
                <div className="fc-badge-dot" />
                <span>Circular Economy · Zero Waste</span>
              </div>

              <h1 className={cl("fc-h1 fc-fade d1", vis)}>
                Flora
                <em>Cycle.</em>
              </h1>

              <p className={cl("fc-tagline fc-fade d2", vis)}>
                Turning Sacred Flowers Into<br />Sustainable Futures
              </p>

              <div className={cl("fc-divider fc-fade d2", vis)}>
                <div className="fc-divider-line" />
                <span className="fc-divider-dots">✦ ✦ ✦</span>
              </div>

              <p className={cl("fc-mission fc-fade d3", vis)}>
                We connect temples and flower vendors to collect discarded sacred blooms —
                transforming them into incense sticks, natural dyes, compost, and
                handcrafted goods. Every petal finds new purpose in our circular ecosystem.
              </p>

              <div className={cl("fc-tags fc-fade d4", vis)}>
                <span className="fc-tag">Incense Sticks</span>
                <span className="fc-tag">Natural Dyes</span>
                <span className="fc-tag">Compost</span>
                <span className="fc-tag">Handmade Goods</span>
              </div>

              <div className={cl("fc-cta-row fc-fade d5", vis)}>
                <a href="/register" className="fc-btn fc-btn-primary">Register</a>
                <a href="/login" className="fc-btn fc-btn-ghost">Login</a>
              </div>

            </div>
          </div>

          

        </div>
      </div>
    </>
  );
}
