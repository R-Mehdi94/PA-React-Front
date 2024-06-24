import { FunctionComponent } from "react";
import DemandeForm from "../components/forms/demandes/DemandeForm";

const Demande: FunctionComponent = () => {
    return (
        <div>
          <center>
          <h1>Formulaire de Demande</h1>
          </center>
          <DemandeForm />
        </div>
    )
};

export default Demande;
