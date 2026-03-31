import { useState, useEffect } from "react";
import { getUser, logout, getVendorDashboard, getVendorPickups, getVendorRequests, getAllListings, sendPickupRequest, completePickupVendor } from "../api";

const dashStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=DM+Sans:wght@200;300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #faf7ff; overflow-x: hidden; }
  .db-blob { position:fixed; border-radius:50%; filter:blur(90px); opacity:0.35; pointer-events:none; z-index:0; }
  .dbb1 { width:600px; height:600px; top:-150px; left:-150px; background:radial-gradient(circle,#e2ccf8,#d4baf2 45%,transparent 70%); animation:dbb1 20s ease-in-out infinite alternate; }
  .dbb2 { width:500px; height:500px; bottom:-100px; right:-100px; background:radial-gradient(circle,#efe4ff,#ccb2ee 55%,transparent 75%); animation:dbb2 15s ease-in-out infinite alternate; }
  @keyframes dbb1 { from{transform:translate(0,0)} to{transform:translate(50px,35px)} }
  @keyframes dbb2 { from{transform:translate(0,0)} to{transform:translate(-40px,-40px)} }
  .db-layout { display:flex; min-height:100vh; position:relative; z-index:1; }
  .db-sidebar { width:260px; flex-shrink:0; background:rgba(255,255,255,0.72); backdrop-filter:blur(20px); border-right:1px solid rgba(180,140,230,0.15); display:flex; flex-direction:column; padding:1.8rem 0; position:sticky; top:0; height:100vh; overflow-y:auto; }
  .db-logo { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:500; color:#2a0a40; padding:0 1.6rem 1.6rem; border-bottom:1px solid rgba(180,140,230,0.12); margin-bottom:1.2rem; text-decoration:none; display:block; }
  .db-logo em { font-style:italic; color:#8040b8; }
  .db-section-label { font-size:0.6rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#b090d0; padding:0 1.6rem; margin:1rem 0 0.4rem; }
  .db-nav-item { display:flex; align-items:center; gap:10px; padding:10px 1.6rem; margin:2px 0.8rem; border-radius:12px; cursor:pointer; font-size:0.84rem; color:#6a4888; font-weight:400; transition:all 0.2s; }
  .db-nav-item:hover { background:rgba(180,130,240,0.08); color:#5a1a90; }
  .db-nav-item.active { background:linear-gradient(135deg,rgba(96,32,160,0.12),rgba(144,80,200,0.08)); color:#5a1a90; font-weight:500; }
  .db-nav-icon { font-size:1rem; width:20px; text-align:center; }
  .db-sidebar-spacer { flex:1; }
  .db-user { margin:1rem 0.8rem 0; padding:12px 14px; background:rgba(180,130,240,0.08); border:1px solid rgba(180,130,240,0.15); border-radius:14px; display:flex; align-items:center; gap:10px; }
  .db-user-av { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#2a7a28,#4aaa48); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:600; color:white; flex-shrink:0; }
  .db-user-name { font-size:0.82rem; font-weight:500; color:#2a0a40; }
  .db-user-role { font-size:0.68rem; color:#9878b8; }
  .db-main { flex:1; padding:2.4rem 2.8rem; overflow-y:auto; }
  .db-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem; }
  .db-greeting { font-size:0.78rem; color:#9878b8; margin-bottom:4px; }
  .db-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:400; color:#1e0535; letter-spacing:-0.02em; }
  .metrics-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.6rem; }
  .metric-card { background:rgba(255,255,255,0.72); backdrop-filter:blur(14px); border:1px solid rgba(180,140,230,0.15); border-radius:18px; padding:1.4rem; transition:transform 0.2s; }
  .metric-card:hover { transform:translateY(-2px); }
  .metric-icon { font-size:1.5rem; margin-bottom:0.6rem; }
  .metric-val { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:500; color:#5a1a90; letter-spacing:-0.03em; line-height:1; margin-bottom:4px; }
  .metric-label { font-size:0.72rem; color:#9878b8; font-weight:400; }
  .db-card { background:rgba(255,255,255,0.72); backdrop-filter:blur(14px); border:1px solid rgba(180,140,230,0.15); border-radius:18px; padding:1.6rem; margin-bottom:1.4rem; }
  .db-card-title { font-size:0.88rem; font-weight:600; color:#2a0a40; margin-bottom:1.2rem; display:flex; justify-content:space-between; align-items:center; }
  .db-card-title a { font-size:0.75rem; color:#8040b8; cursor:pointer; font-weight:400; }
  .db-table { width:100%; border-collapse:collapse; font-size:0.82rem; }
  .db-table th { text-align:left; font-size:0.65rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#9878b8; padding:0 12px 10px; border-bottom:1px solid rgba(180,140,230,0.15); }
  .db-table td { padding:12px; border-bottom:1px solid rgba(180,140,230,0.08); color:#3a1a50; vertical-align:middle; }
  .db-table tr:last-child td { border-bottom:none; }
  .db-table tr:hover td { background:rgba(180,130,240,0.04); }
  .td-name { font-weight:500; }
  .td-sub { font-size:0.72rem; color:#9878b8; font-weight:400; margin-top:2px; }
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:50px; font-size:0.68rem; font-weight:500; }
  .badge-pending { background:rgba(255,180,0,0.12); color:#b07800; border:1px solid rgba(255,180,0,0.2); }
  .badge-accepted { background:rgba(42,154,90,0.1); color:#1a7a48; border:1px solid rgba(42,154,90,0.2); }
  .badge-completed { background:rgba(96,32,160,0.1); color:#5a1a90; border:1px solid rgba(96,32,160,0.15); }
  .badge-rejected { background:rgba(220,50,50,0.08); color:#c02020; border:1px solid rgba(220,50,50,0.15); }
  .badge-urgent { background:rgba(220,80,20,0.1); color:#b04010; border:1px solid rgba(220,80,20,0.15); }
  .badge-normal { background:rgba(180,130,240,0.1); color:#7030a8; border:1px solid rgba(180,130,240,0.2); }
  .db-btn { padding:8px 18px; border-radius:50px; font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500; cursor:pointer; border:none; transition:all 0.22s; }
  .db-btn-primary { background:linear-gradient(135deg,#6020a0,#9050c8); color:white; box-shadow:0 4px 14px rgba(96,32,160,0.28); }
  .db-btn-primary:hover { transform:translateY(-1px); }
  .db-btn-green { background:linear-gradient(135deg,#2a7a28,#4aaa48); color:white; box-shadow:0 4px 14px rgba(42,122,40,0.28); }
  .db-btn-green:hover { transform:translateY(-1px); }
  .db-btn-ghost { background:rgba(255,255,255,0.6); color:#7030a8; border:1.5px solid rgba(120,60,180,0.22); }
  .db-btn-ghost:hover { background:rgba(180,130,240,0.08); }
  .db-btn-sm { padding:6px 14px; font-size:0.73rem; }
  .db-logout { margin:0.6rem 0.8rem 0; padding:9px 14px; border-radius:12px; background:rgba(220,50,50,0.06); color:#c02020; border:1px solid rgba(220,50,50,0.15); font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500; cursor:pointer; width:calc(100% - 1.6rem); transition:all 0.2s; text-align:left; }
  .db-logout:hover { background:rgba(220,50,50,0.12); }
  .empty-state { text-align:center; padding:3rem 1rem; color:#9878b8; font-size:0.88rem; }
  .empty-state-icon { font-size:2.5rem; margin-bottom:0.8rem; opacity:0.4; }
  .loading { text-align:center; padding:2rem; color:#9878b8; font-size:0.88rem; }
  @media(max-width:1100px) { .metrics-grid{grid-template-columns:repeat(2,1fr)} }
  @media(max-width:900px) { .db-layout{flex-direction:column} .db-sidebar{width:100%;height:auto;position:relative} .db-main{padding:1.4rem} .metrics-grid{grid-template-columns:repeat(2,1fr)} }
`;

export default function VendorDashboard() {
  const [section, setSection]   = useState("overview");
  const [data, setData]         = useState(null);
  const [pickups, setPickups]   = useState([]);
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const user = getUser();
  const initials = user?.name ? user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "EB";

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dash, p, r, l] = await Promise.all([
        getVendorDashboard(),
        getVendorPickups(),
        getVendorRequests(),
        getAllListings(),
      ]);
      setData(dash);
      setPickups(p);
      setRequests(r);
      setListings(l);
    } catch (err) { console.error(err.message); }
    setLoading(false);
  };

  const handleSendRequest = async (templeId, flowerType, quantity, listingId) => {
    try {
      await sendPickupRequest(templeId, flowerType, quantity, listingId);
      alert("Request sent to temple!");
      await loadAll();
    } catch (err) { alert(err.message); }
  };

  const handleComplete = async (id) => {
    try {
      await completePickupVendor(id);
      await loadAll();
    } catch (err) { alert(err.message); }
  };

  const stats = data?.stats || { totalCollected:0, activePickups:0, completedPickups:0, templePartners:0 };

  return (
    <>
      <style>{dashStyles}</style>
      <div className="db-blob dbb1" />
      <div className="db-blob dbb2" />

      <div className="db-layout">
        {/* Sidebar */}
        <aside className="db-sidebar">
          <a href="/" className="db-logo">Flora<em>Cycle</em></a>
          <div className="db-section-label">Main</div>
          {[
            { key:"overview", icon:"🏠", label:"Overview" },
            { key:"pickups",  icon:"🚚", label:"My Pickups" },
            { key:"requests", icon:"📋", label:"My Requests" },
            { key:"explore",  icon:"🔍", label:"Find Temples" },
          ].map(s => (
            <div key={s.key} className={`db-nav-item ${section===s.key?"active":""}`} onClick={() => setSection(s.key)}>
              <span className="db-nav-icon">{s.icon}</span> {s.label}
            </div>
          ))}
          <div className="db-section-label">Account</div>
          <div className="db-nav-item"><span className="db-nav-icon">👤</span> Profile</div>
          <div className="db-sidebar-spacer" />
          <div className="db-user">
            <div className="db-user-av">{initials}</div>
            <div>
              <div className="db-user-name">{user?.name || "Vendor"}</div>
              <div className="db-user-role">Vendor Account</div>
            </div>
          </div>
          <button className="db-logout" onClick={logout}>🚪 Sign Out</button>
        </aside>

        <main className="db-main">
          {loading ? (
            <div className="loading">Loading your dashboard...</div>
          ) : (
            <>
              {/* OVERVIEW */}
              {section === "overview" && (
                <>
                  <div className="db-header">
                    <div>
                      <div className="db-greeting">Welcome back 🌿</div>
                      <h1 className="db-title">{user?.name || "Vendor"}</h1>
                    </div>
                    <button type="button" className="db-btn db-btn-green" onClick={() => setSection("explore")}>
                      🔍 Find Temples
                    </button>
                  </div>

                  <div className="metrics-grid">
                    {[
                      { icon:"📦", val:`${stats.totalCollected} kg`, label:"Total Collected" },
                      { icon:"🚚", val:stats.activePickups,          label:"Active Pickups" },
                      { icon:"✅", val:stats.completedPickups,       label:"Completed Pickups" },
                      { icon:"🏛️", val:stats.templePartners,         label:"Temple Partners" },
                    ].map(m => (
                      <div className="metric-card" key={m.label}>
                        <div className="metric-icon">{m.icon}</div>
                        <div className="metric-val">{m.val}</div>
                        <div className="metric-label">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="db-card">
                    <div className="db-card-title">
                      Active Pickups
                      <a onClick={() => setSection("pickups")}>View All →</a>
                    </div>
                    {pickups.filter(p => p.status === "accepted").length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">🚚</div>
                        No active pickups. Browse temples to send a request.
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr><th>Temple</th><th>Flower</th><th>Qty</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {pickups.filter(p => p.status === "accepted").map(p => (
                            <tr key={p._id}>
                              <td className="td-name">{p.temple?.name || "—"}<div className="td-sub">{p.temple?.city}</div></td>
                              <td>{p.flowerType}</td>
                              <td>{p.quantity} kg</td>
                              <td><span className="badge badge-accepted">Active</span></td>
                              <td>
                                <button type="button" className="db-btn db-btn-green db-btn-sm" onClick={() => handleComplete(p._id)}>
                                  Mark Collected
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}

              {/* MY PICKUPS */}
              {section === "pickups" && (
                <>
                  <div className="db-header">
                    <div>
                      <div className="db-greeting">Your collection history</div>
                      <h1 className="db-title">My Pickups</h1>
                    </div>
                  </div>
                  <div className="db-card">
                    <div className="db-card-title">Pickup History ({pickups.length})</div>
                    {pickups.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        No pickups yet. Find temples and send requests to get started.
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr><th>Temple</th><th>Flower</th><th>Qty</th><th>Date</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {pickups.map(p => (
                            <tr key={p._id}>
                              <td className="td-name">{p.temple?.name || "—"}<div className="td-sub">{p.temple?.city}</div></td>
                              <td>{p.flowerType}</td>
                              <td>{p.quantity} kg</td>
                              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                              <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                              <td>
                                {p.status === "accepted" && (
                                  <button type="button" className="db-btn db-btn-green db-btn-sm" onClick={() => handleComplete(p._id)}>
                                    Mark Collected
                                  </button>
                                )}
                                {p.status !== "accepted" && "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}

              {/* MY REQUESTS */}
              {section === "requests" && (
                <>
                  <div className="db-header">
                    <div>
                      <div className="db-greeting">Requests you've sent to temples</div>
                      <h1 className="db-title">My Requests</h1>
                    </div>
                  </div>
                  <div className="db-card">
                    <div className="db-card-title">All Requests ({requests.length})</div>
                    {requests.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        No requests sent yet. Explore temple listings to send your first request.
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr><th>Temple</th><th>Flower</th><th>Qty</th><th>Sent On</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                          {requests.map(r => (
                            <tr key={r._id}>
                              <td className="td-name">{r.temple?.name || "—"}<div className="td-sub">{r.temple?.city}</div></td>
                              <td>{r.flowerType}</td>
                              <td>{r.quantity} kg</td>
                              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                              <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}

              {/* EXPLORE / FIND TEMPLES */}
              {section === "explore" && (
                <>
                  <div className="db-header">
                    <div>
                      <div className="db-greeting">Browse available flower listings</div>
                      <h1 className="db-title">Find Temples</h1>
                    </div>
                  </div>
                  <div className="db-card">
                    <div className="db-card-title">Available Listings ({listings.length})</div>
                    {listings.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">🏛️</div>
                        No listings available right now. Check back later.
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr><th>Temple</th><th>City</th><th>Flower</th><th>Qty</th><th>Condition</th><th>Urgency</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {listings.map(l => (
                            <tr key={l._id}>
                              <td className="td-name">{l.temple?.name || "—"}</td>
                              <td>{l.temple?.city || "—"}</td>
                              <td>{l.flowerType}</td>
                              <td>{l.quantity} kg</td>
                              <td>{l.condition}</td>
                              <td><span className={`badge badge-${l.urgency?.toLowerCase()}`}>{l.urgency}</span></td>
                              <td>
                                <button
                                  type="button"
                                  className="db-btn db-btn-primary db-btn-sm"
                                  onClick={() => handleSendRequest(l.temple?._id, l.flowerType, l.quantity, l._id)}
                                >
                                  Send Request
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}