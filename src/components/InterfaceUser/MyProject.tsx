import React, { useEffect, useState } from "react";
import ProfilNavigation from "../../pages/ProfilNavigation";
import { AideProjet, getProjects } from "../../api/apiService";
import "../../css/profil.css"; // Assurez-vous que le fichier CSS est importé

const MyProjects: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [projects, setProjects] = useState<AideProjet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects(storedUser.adherent.id);
        if (response && response.AideProjets) {
          setProjects(response.AideProjets);
        } else {
          setError('Error fetching projects');
        }
      } catch (err) {
        setError('Error fetching projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [storedUser.adherent.id]);

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
    <div className="profile-container">
      <ProfilNavigation />
      <div className="profile-details">
        <h2>Mes Projets</h2>
        {error && <div className="error-message">{error}</div>}
        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project.id} className="project-card">
              <h3>{project.titre}</h3>
              <p>Description: {project.descriptionProjet}</p>
              <p>Budget: {project.budget} €</p>
              <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyProjects;
