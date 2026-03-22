import "./style.css";

function Footer() {
  return (
    <footer className="footer">

      {/* Wave */}
      <div className="wave">
        <svg viewBox="0 0 1440 120">
          <path
            fill="#E6E6FA"
            d="M0,96L60,80C120,64,240,32,360,32C480,32,600,64,720,74.7C840,85,960,75,1080,69.3C1200,64,1320,64,1380,64L1440,64L1440,0L0,0Z"
          />
        </svg>
      </div>

      <div className="footer-section">
        <h2 className="heading">🌸 Floral Cycle</h2>
        <p className="heading">
          Transforming temple flower waste into eco-friendly products  
          and connecting temples with recycling vendors.
        </p>
      </div>

      <div className="footer-container">
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="#">Login</a>
          <a href="#">Dashboard</a>
          <a href="#">Marketplace</a>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 Hyderabad, India</p>
          <p>📧 floralcycle@email.com</p>
          <p>📞 +91 9876543210</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social">
            <a href="#"><i className="fab fa-instagram"></i> Instagram</a>
            <a href="#"><i className="fab fa-twitter"></i> Twitter</a>
            <a href="#"><i className="fab fa-linkedin"></i> LinkedIn</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        ©️ 2026 Floral Cycle • Sustainable Flower Recycling 🌿
      </div>

    </footer>
  );
}

export default Footer;