export const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=DM+Sans:wght@200;300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow-x: hidden; font-family: 'DM Sans', sans-serif; }

  /* ── Background blobs ── */
  .auth-blob {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.45;
    pointer-events: none; z-index: 0;
  }
  .ab1 {
    width: 650px; height: 650px; top: -200px; left: -180px;
    background: radial-gradient(circle, #e2ccf8 0%, #d4baf2 45%, transparent 70%);
    animation: ab1 20s ease-in-out infinite alternate;
  }
  .ab2 {
    width: 500px; height: 600px; bottom: -120px; right: -120px;
    background: radial-gradient(circle, #efe4ff 0%, #ccb2ee 55%, transparent 75%);
    animation: ab2 15s ease-in-out infinite alternate;
  }
  @keyframes ab1 { from{transform:translate(0,0)} to{transform:translate(55px,35px)} }
  @keyframes ab2 { from{transform:translate(0,0)} to{transform:translate(-45px,-45px)} }

  /* ── Page wrapper ── */
  .auth-page {
    min-height: 100vh;
    background: #faf7ff;
    position: relative;
    display: flex; flex-direction: column;
  }

  /* ── Navbar ── */
  .auth-nav {
    position: relative; z-index: 30;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.4rem 4rem;
    background: rgba(250,247,255,0.8);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(180,140,220,0.12);
  }
  .auth-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.45rem; font-weight: 500;
    color: #2a0a40; text-decoration: none;
  }
  .auth-logo em { font-style: italic; color: #8040b8; }
  .auth-nav-link {
    font-size: 0.78rem; color: #7030a8;
    border: 1.5px solid rgba(112,48,168,0.25);
    padding: 7px 18px; border-radius: 50px;
    text-decoration: none; font-weight: 500;
    background: rgba(255,255,255,0.4);
    backdrop-filter: blur(8px); transition: all 0.25s;
  }
  .auth-nav-link:hover { background: rgba(112,48,168,0.07); }

  /* ── Body (centers the card) ── */
  .auth-body {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem;
    position: relative; z-index: 1;
  }

  /* ── Card ── */
  .auth-card {
    width: 100%; max-width: 520px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(180,140,230,0.18);
    border-radius: 24px;
    padding: 2.8rem 3rem;
    box-shadow: 0 4px 40px rgba(140,80,220,0.1), 0 1px 0 rgba(255,255,255,0.8) inset;
    animation: cardIn 0.7s ease both;
  }
  .auth-card-sm { max-width: 460px; }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(22px) scale(0.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  /* ── Card title & subtitle ── */
  .auth-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 400;
    color: #1e0535; letter-spacing: -0.02em; margin-bottom: 0.4rem;
  }
  .auth-sub {
    font-size: 0.82rem; color: #9878b8;
    font-weight: 300; margin-bottom: 1.8rem; line-height: 1.5;
  }

  /* ── Role toggle ── */
  .role-toggle {
    display: flex;
    border: 1.5px solid rgba(180,130,240,0.25);
    border-radius: 50px; overflow: hidden;
    margin-bottom: 1.8rem; position: relative;
    background: rgba(255,255,255,0.5);
  }
  .role-btn {
    flex: 1; padding: 11px 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.84rem; font-weight: 500;
    border: none; cursor: pointer;
    background: transparent; color: #9878b8;
    transition: all 0.28s; position: relative; z-index: 2;
  }
  .role-btn.active { color: white; }
  .role-slider {
    position: absolute; top: 0; bottom: 0; left: 0;
    width: 50%;
    background: linear-gradient(135deg, #6020a0, #9050c8);
    border-radius: 50px;
    transition: transform 0.32s cubic-bezier(0.34,1.2,0.64,1);
    z-index: 1;
    box-shadow: 0 4px 18px rgba(96,32,160,0.3);
  }
  .role-slider.vendor { transform: translateX(100%); }

  /* ── Form layout ── */
  .form-row { display: flex; gap: 1rem; }
  .form-row .field { flex: 1; }

  /* ── Field ── */
  .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 1rem; }
  .field label {
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #6a4888;
  }
  .field input, .field select {
    padding: 12px 15px;
    border: 1.5px solid rgba(180,130,240,0.22);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; color: #2a0a40;
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(8px);
    transition: all 0.2s; outline: none; width: 100%;
  }
  .field input::placeholder { color: #c0a8d8; }
  .field select {
    cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239050c8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 36px; background-color: rgba(255,255,255,0.7);
  }
  .field input:focus, .field select:focus {
    border-color: rgba(140,70,210,0.5);
    background: rgba(255,255,255,0.95);
    box-shadow: 0 0 0 3px rgba(140,70,210,0.09);
  }

  /* ── Submit button ── */
  .auth-submit {
    width: 100%; padding: 14px;
    border: none; border-radius: 50px; margin-top: 0.4rem;
    background: linear-gradient(135deg, #6020a0 0%, #9050c8 60%, #b070e0 100%);
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; font-weight: 500;
    letter-spacing: 0.07em; cursor: pointer;
    box-shadow: 0 8px 28px rgba(96,32,160,0.32);
    transition: all 0.28s ease;
  }
  .auth-submit:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(96,32,160,0.42); }

  /* ── Forgot password ── */
  .forgot-row { text-align: right; margin-top: -4px; margin-bottom: 1.4rem; }
  .forgot-link {
    font-size: 0.78rem; color: #9050c8;
    text-decoration: none; font-weight: 500;
  }
  .forgot-link:hover { color: #6020a0; }

  /* ── Footer link ── */
  .auth-footer {
    text-align: center; margin-top: 1.4rem;
    font-size: 0.78rem; color: #9878b8;
  }
  .auth-footer a { color: #7030a8; text-decoration: none; font-weight: 500; }
  .auth-footer a:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 580px) {
    .auth-card { padding: 2rem 1.6rem; }
    .auth-nav { padding: 1.3rem 1.5rem; }
    .form-row { flex-direction: column; gap: 0; }
  }
`;
