// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/apiService";
import { useAuth } from "../routeProtected/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login: authLogin } = useAuth(); // Utiliser la fonction de connexion du contexte d'authentification

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    
    try {
      const user = await login({ email : email, motDePasse: password });
  
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

  if (isLoading) {
    
    return <center>
          <div className="loader">
            <div className="square-1 square"></div>
            <div className="square-2 square"></div>
          </div>
      </center>
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
