import { useState, useEffect } from "react";
import { getUser, logout, getTempleDashboard, getTemplePickups, getTempleListings, addListing, removeListing, acceptPickup, rejectPickup } from "../api";

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
  .db-user-av { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#6020a0,#9050c8); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:600; color:white; flex-shrink:0; }
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
  .db-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; margin-bottom:1.4rem; }
  .db-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1.4rem; margin-bottom:1.4rem; }
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
  .db-btn-ghost { background:rgba(255,255,255,0.6); color:#7030a8; border:1.5px solid rgba(120,60,180,0.22); }
  .db-btn-ghost:hover { background:rgba(180,130,240,0.08); }
  .db-btn-danger { background:rgba(220,50,50,0.06); color:#c02020; border:1px solid rgba(220,50,50,0.15); }
  .db-btn-sm { padding:6px 14px; font-size:0.73rem; }
  .db-logout { margin:0.6rem 0.8rem 0; padding:9px 14px; border-radius:12px; background:rgba(220,50,50,0.06); color:#c02020; border:1px solid rgba(220,50,50,0.15); font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500; cursor:pointer; width:calc(100% - 1.6rem); transition:all 0.2s; text-align:left; }
  .db-logout:hover { background:rgba(220,50,50,0.12); }
  .empty-state { text-align:center; padding:3rem 1rem; color:#9878b8; font-size:0.88rem; }
  .empty-state-icon { font-size:2.5rem; margin-bottom:0.8rem; opacity:0.4; }
  .loading { text-align:center; padding:2rem; color:#9878b8; font-size:0.88rem; }
  .form-row { display:flex; gap:1rem; }
  .form-row .field { flex:1; }
  .field { display:flex; flex-direction:column; gap:5px; margin-bottom:1rem; }
  .field label { font-size:0.68rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#6a4888; }
  .field input, .field select { padding:11px 14px; border:1.5px solid rgba(180,130,240,0.22); border-radius:12px; font-family:'DM Sans',sans-serif; font-size:0.88rem; color:#2a0a40; background:rgba(255,255,255,0.7); outline:none; width:100%; transition:all 0.2s; }
  .field input:focus, .field select:focus { border-color:rgba(140,70,210,0.5); box-shadow:0 0 0 3px rgba(140,70,210,0.08); }
  .listing-card { background:rgba(255,255,255,0.72); backdrop-filter:blur(14px); border:1px solid rgba(180,140,230,0.15); border-radius:18px; padding:1.4rem; }
  .listing-card-add { border:2px dashed rgba(180,130,240,0.3); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:200px; cursor:pointer; border-radius:18px; transition:all 0.2s; padding:1.4rem; }
  .listing-card-add:hover { border-color:rgba(120,60,180,0.5); background:rgba(180,130,240,0.04); }
  .modal-overlay { position:fixed; inset:0; background:rgba(30,5,53,0.45); backdrop-filter:blur(6px); z-index:100; display:flex; align-items:center; justify-content:center; padding:1rem; }
  .modal-box { background:rgba(255,255,255,0.95); border-radius:20px; padding:2rem; width:100%; max-width:440px; box-shadow:0 20px 60px rgba(96,32,160,0.2); }
  .modal-title { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:400; color:#1e0535; margin-bottom:0.3rem; }
  .modal-sub { font-size:0.8rem; color:#9878b8; margin-bottom:1.6rem; }
  .modal-actions { display:flex; gap:0.8rem; margin-top:0.6rem; }
  @media(max-width:1100px) { .metrics-grid{grid-template-columns:repeat(2,1fr)} }
  @media(max-width:900px) { .db-layout{flex-direction:column} .db-sidebar{width:100%;height:auto;position:relative} .db-main{padding:1.4rem} .db-grid,.db-grid-3{grid-template-columns:1fr} .metrics-grid{grid-template-columns:repeat(2,1fr)} }
`;

export default function TempleDashboard() {
  const [section, setSection]   = useState("overview");
  const [data, setData]         = useState(null);
  const [pickups, setPickups]   = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ flowerType:"", quantity:"", condition:"Fresh", urgency:"Normal" });

  const user = getUser();
  const initials = user?.name ? user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "ST";

  // Load dashboard data
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dash, p, l] = await Promise.all([
        getTempleDashboard(),
        getTemplePickups(),
        getTempleListings(),
      ]);
      setData(dash);
      setPickups(p);
      setListings(l);
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };

  const handleAccept = async (id) => {
    try { await acceptPickup(id); await loadDashboard(); }
    catch (err) { alert(err.message); }
  };

  const handleReject = async (id) => {
    try { await rejectPickup(id); await loadDashboard(); }
    catch (err) { alert(err.message); }
  };

  const handleRemoveListing = async (id) => {
    try { await removeListing(id); await loadDashboard(); }
    catch (err) { alert(err.message); }
  };

  const handleAddListing = async () => {
    if (!form.flowerType || !form.quantity) return alert("Fill in all fields");
    try {
      await addListing(form);
      setShowModal(false);
      setForm({ flowerType:"", quantity:"", condition:"Fresh", urgency:"Normal" });
      await loadDashboard();
    } catch (err) { alert(err.message); }
  };

  const stats = data?.stats || { totalRecycled:0, totalPickups:0, pendingRequests:0, acceptedPickups:0 };

  return (
    <>
      <style>{dashStyles}</style>
      <div className="db-blob dbb1" />
      <div className="db-blob dbb2" />

      {/* Add Listing Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Flower Listing</div>
            <p className="modal-sub">List today's sacred flowers for vendor pickup</p>
            <div className="field">
              <label>Flower Type</label>
              <input placeholder="e.g. Marigold, Rose" value={form.flowerType}
                onChange={e => setForm({...form, flowerType: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="field">
                <label>Quantity (kg)</label>
                <input type="number" placeholder="e.g. 10" value={form.quantity}
                  onChange={e => setForm({...form, quantity: e.target.value})} />
              </div>
              <div className="field">
                <label>Condition</label>
                <select value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                  <option>Fresh</option>
                  <option>1 Day Old</option>
                  <option>2 Days Old</option>
                  <option>Mixed</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Urgency</label>
              <select value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})}>
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="db-btn db-btn-primary" style={{flex:1}} onClick={handleAddListing}>
                Add Listing
              </button>
              <button type="button" className="db-btn db-btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="db-layout">
        {/* Sidebar */}
        <aside className="db-sidebar">
          <a href="/" className="db-logo">Flora<em>Cycle</em></a>
          <div className="db-section-label">Main</div>
          {["overview","pickups","listings"].map(s => (
            <div key={s} className={`db-nav-item ${section===s?"active":""}`} onClick={() => setSection(s)}>
              <span className="db-nav-icon">{s==="overview"?"🏠":s==="pickups"?"🚚":"🌸"}</span>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </div>
          ))}
          <div className="db-section-label">Account</div>
          <div className="db-nav-item"><span className="db-nav-icon">👤</span> Profile</div>
          <div className="db-sidebar-spacer" />
          <div className="db-user">
            <div className="db-user-av">{initials}</div>
            <div>
              <div className="db-user-name">{user?.name || "Temple"}</div>
              <div className="db-user-role">Temple Account</div>
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
                      <div className="db-greeting">Welcome back 🙏</div>
                      <h1 className="db-title">{user?.name || "Temple"}</h1>
                    </div>
                    <button type="button" className="db-btn db-btn-primary" onClick={() => setShowModal(true)}>
                      + Add Flower Listing
                    </button>
                  </div>

                  <div className="metrics-grid">
                    {[
                      { icon:"♻️", val:`${stats.totalRecycled} kg`, label:"Total Recycled" },
                      { icon:"🚚", val:stats.totalPickups,          label:"Pickups Completed" },
                      { icon:"⏳", val:stats.pendingRequests,       label:"Pending Requests" },
                      { icon:"✅", val:stats.acceptedPickups,       label:"Accepted Pickups" },
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
                      Recent Pickup Requests
                      <a onClick={() => setSection("pickups")}>View All →</a>
                    </div>
                    {pickups.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">🚚</div>
                        No pickup requests yet. Add a flower listing to get started.
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr><th>Vendor</th><th>Flower</th><th>Qty</th><th>Urgency</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {pickups.slice(0,5).map(p => (
                            <tr key={p._id}>
                              <td className="td-name">{p.vendor?.company || "—"}<div className="td-sub">{p.vendor?.city}</div></td>
                              <td>{p.flowerType}</td>
                              <td>{p.quantity} kg</td>
                              <td><span className={`badge badge-${p.urgency?.toLowerCase()}`}>{p.urgency}</span></td>
                              <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                              <td>
                                {p.status === "pending" && (
                                  <div style={{display:"flex",gap:6}}>
                                    <button type="button" className="db-btn db-btn-primary db-btn-sm" onClick={() => handleAccept(p._id)}>Accept</button>
                                    <button type="button" className="db-btn db-btn-danger db-btn-sm" onClick={() => handleReject(p._id)}>Reject</button>
                                  </div>
                                )}
                                {p.status !== "pending" && "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="db-card">
                    <div className="db-card-title">
                      Active Listings
                      <a onClick={() => setSection("listings")}>Manage →</a>
                    </div>
                    {listings.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">🌸</div>
                        No active listings. Click "Add Flower Listing" to create one.
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr><th>Flower Type</th><th>Quantity</th><th>Condition</th><th>Urgency</th><th>Posted</th></tr>
                        </thead>
                        <tbody>
                          {listings.map(l => (
                            <tr key={l._id}>
                              <td className="td-name">{l.flowerType}</td>
                              <td>{l.quantity} kg</td>
                              <td>{l.condition}</td>
                              <td><span className={`badge badge-${l.urgency?.toLowerCase()}`}>{l.urgency}</span></td>
                              <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}

              {/* PICKUPS */}
              {section === "pickups" && (
                <>
                  <div className="db-header">
                    <div>
                      <div className="db-greeting">Manage your collection schedule</div>
                      <h1 className="db-title">Pickup Requests</h1>
                    </div>
                  </div>
                  <div className="db-card">
                    <div className="db-card-title">All Requests ({pickups.length})</div>
                    {pickups.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">🚚</div>
                        No pickup requests yet.
                      </div>
                    ) : (
                      <table className="db-table">
                        <thead>
                          <tr><th>Vendor</th><th>Flower</th><th>Qty</th><th>Condition</th><th>Urgency</th><th>Date</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {pickups.map(p => (
                            <tr key={p._id}>
                              <td className="td-name">{p.vendor?.company || "—"}<div className="td-sub">{p.vendor?.city}</div></td>
                              <td>{p.flowerType}</td>
                              <td>{p.quantity} kg</td>
                              <td>{p.condition}</td>
                              <td><span className={`badge badge-${p.urgency?.toLowerCase()}`}>{p.urgency}</span></td>
                              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                              <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                              <td>
                                {p.status === "pending" && (
                                  <div style={{display:"flex",gap:6}}>
                                    <button type="button" className="db-btn db-btn-primary db-btn-sm" onClick={() => handleAccept(p._id)}>Accept</button>
                                    <button type="button" className="db-btn db-btn-danger db-btn-sm" onClick={() => handleReject(p._id)}>Reject</button>
                                  </div>
                                )}
                                {p.status !== "pending" && "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}

              {/* LISTINGS */}
              {section === "listings" && (
                <>
                  <div className="db-header">
                    <div>
                      <div className="db-greeting">What you've listed for pickup</div>
                      <h1 className="db-title">Flower Listings</h1>
                    </div>
                    <button type="button" className="db-btn db-btn-primary" onClick={() => setShowModal(true)}>
                      + Add New Listing
                    </button>
                  </div>

                  {listings.length === 0 ? (
                    <div className="db-card">
                      <div className="empty-state">
                        <div className="empty-state-icon">🌸</div>
                        No listings yet. Add your first flower listing above.
                      </div>
                    </div>
                  ) : (
                    <div className="db-grid-3">
                      {listings.map(l => (
                        <div key={l._id} className="listing-card" style={{ borderTop:`3px solid #9050c8` }}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
                            <span style={{fontSize:"2rem"}}>🌸</span>
                            <span className={`badge badge-${l.urgency?.toLowerCase()}`}>{l.urgency}</span>
                          </div>
                          <div style={{fontWeight:600,fontSize:"1rem",marginBottom:4}}>{l.flowerType}</div>
                          <div style={{fontSize:"0.82rem",color:"#9878b8",marginBottom:16}}>{l.condition} • {new Date(l.createdAt).toLocaleDateString()}</div>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",color:"#5a1a90",marginBottom:4}}>{l.quantity} kg</div>
                          <div style={{fontSize:"0.78rem",color:"#9878b8",marginBottom:16}}>Available for pickup</div>
                          <button type="button" className="db-btn db-btn-danger db-btn-sm" style={{width:"100%"}} onClick={() => handleRemoveListing(l._id)}>
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="listing-card-add" onClick={() => setShowModal(true)}>
                        <div style={{fontSize:"2.5rem",marginBottom:12,opacity:0.3}}>+</div>
                        <div style={{fontSize:"0.9rem",color:"#6a4888",fontWeight:500}}>Add New Listing</div>
                        <div style={{fontSize:"0.78rem",color:"#9878b8",marginTop:4}}>List today's offerings</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}