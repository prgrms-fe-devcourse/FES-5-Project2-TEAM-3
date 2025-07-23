

import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">    
          <button className="footer-logo"><img src="/logo.svg" alt="OTTogether Logo" /></button>          
        <div className='footer-content'>
         <p className="footer-team">FES-5-Project2-TEAM-3</p>
         <ul className="footer-links">
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