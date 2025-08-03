import { Link } from 'react-router-dom';
import S from './Footer.module.css';

function Footer() {
  return (
    <footer className={S['footer']}>
      <div className={S['footer-inner']}>
        <Link to="/" className={S['footer-logo']}>
          <img src="/logo.svg" alt="OTTogether Logo" />
        </Link>
        <div className={S['footer-content']}>
          <p className={S['footer-team']}>FES-5-Project2-TEAM-3</p>
          <ul className={S['footer-links']}>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
