import { FunctionComponent, useState } from "react";
import logo from '../images/logo.webp';
import '../css/Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/apiService";
import { useAuth } from '../routeProtected/AuthContext';

const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated, logout: authLogout } = useAuth();

  const getUserFromLocalStorage = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr); 
    }
    return null;
  };


  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const user = getUserFromLocalStorage();
      if (!user) {
        alert("Logout failed");
        setIsLoading(false);
        return;
      }

      const logoutResponse = await logout({ id: user.adherent.id, token: user.token });

      if (!logoutResponse) {
        alert("Logout failed");
        setIsLoading(false);
        return;
      }

      authLogout(); // Utilisez la fonction de déconnexion du contexte d'authentification
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <center>
        <div className="loader">
          <div className="square-1 square"></div>
          <div className="square-2 square"></div>
        </div>
      </center>
    );
  }

  return (
    <nav className="nav">
      <Link to='/' className="logo">
        <img src={logo} width="100" height="100" alt="logo" />
      </Link>

      <ul className="menu">
        <li><Link to='/'>Accueil</Link></li>
        <li><Link to='/assoEcaf'>L'Association ECAF</Link></li>
        <li><Link to='/evenement'>Evenement</Link></li>
        <li><Link to='/don'>Faire un don</Link></li>
        <li><Link to='/demande'>Une demande ?</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to='/profil/details'>Mon compte</Link></li>
            <li>
              <button onClick={handleLogout}>Déconnexion</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to='/adherer'>Adherez à ECAF</Link></li>
            <li><Link to='/login'>Se connecter</Link></li>
          </>
        )}
        <li><Link to='/contact'>Nous contacter</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
