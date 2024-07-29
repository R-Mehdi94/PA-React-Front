import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, login, sendMdpOublie, verifChangementMdp } from "../api/apiService"; // Assurez-vous d'importer la méthode forgotPassword
import { useAuth } from "../routeProtected/AuthContext";
import '../css/login.css';

function generatePassword(length: number = 12): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }
  return password;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [numTel, setNumTel] = useState<string>("");
  const { login: authLogin } = useAuth(); // Utiliser la fonction de connexion du contexte d'authentification

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    
    try {
      const user = await login({ email: email, motDePasse: password });
      //@ts-ignore
      if (user.adherent.estBanie) {
        alert("Votre compte est banni");
        setIsLoading(false);
        return;
      }
      if (user) {
        authLogin(user); // Utiliser la fonction de connexion du contexte d'authentification
        navigate("/profil/details");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const verif = await verifChangementMdp({ email: forgotEmail, numTel: numTel });
      // @ts-ignore
      if (verif.response === "Compte non trouvé") {
        setIsLoading(false);
        alert('Adherent non trouvé');
        return;
      }

      const newPassword = generatePassword();

      await forgotPassword({ email: forgotEmail, motDePasse: newPassword });

      await sendMdpOublie({ email: forgotEmail, motDePasse: newPassword })

      alert("Un email a été envoyé avec un nouveau mot de passe");

    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Erreur lors de la réinitialisation du mot de passe.");
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
    <div className="login-container">
      {!showForgotPassword ? (
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
          <div className="form-group">
            <button type="button" onClick={() => setShowForgotPassword(true)} className="btn btn-link">Mot de passe oublié ?</button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleForgotPassword} className="forgot-password-form">
          <div className="form-group">
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Email"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={numTel}
              onChange={(e) => setNumTel(e.target.value)}
              placeholder="Numéro de téléphone"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Envoyer</button>
          </div>
          <div className="form-group">
            <button type="button" onClick={() => setShowForgotPassword(false)} className="btn btn-secondary">Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
