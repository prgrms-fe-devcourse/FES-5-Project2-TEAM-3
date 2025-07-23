


import './Footer.module.css'; // 스타일은 따로 분리

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <button className="footer-logo">Logo</button>
          <p className="footer-copyright">Copyright 2025 Company Name.</p>
        </div>
        <ul className="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Cookie Policy</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;