import { FunctionComponent } from "react";
import logo from '../images/logo.webp';
import '../css/Navbar.css';
import { Link } from "react-router-dom";


const Navbar: FunctionComponent = () => {
  return (
    <nav className="nav">
      <Link to='/' className="logo">
        <img src={logo} width="300" height="300" alt="logo" />
      </Link>

      <ul className="menu">
        <li><Link to='/accueil'>Accueil</Link></li>
        <li><Link to='/assoEcaf'>L'Association ECAF</Link></li>
        <li><Link to='/don'>Faire un don</Link></li>
        <li><Link to='/adherer'>Adherez à ECAF</Link></li>
        <li><Link to='/projet'>Une idée de projet ?</Link></li>
        <li><Link to='/parainer'>Parrainage adherent</Link></li>
        <li><Link to='/contact'>Nous contacter</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;