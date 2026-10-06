import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">

        {/* Logo + description */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-icon">G</span>
            <span>GEKO</span>
          </div>

          <p>
            Elevating vocational excellence and shaping
            next-generation architectural minds across
            technical fields.
          </p>
        </div>

        {/* Programs */}
        <div className="footer__column">
          <h3>Programs</h3>

          <a href="#">AI Technologies</a>
          <a href="#">Web Development</a>
          <a href="#">Visual Identity</a>
        </div>

        {/* Company */}
        <div className="footer__column">
          <h3>Company</h3>

          <a href="/about-us">About Our Team</a>
          <a href="#">Join Our Faculty</a>
          <a href="#">Partner Sandbox</a>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© 2026 GEKO Education. All rights reserved.</p>

        <div className="footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;