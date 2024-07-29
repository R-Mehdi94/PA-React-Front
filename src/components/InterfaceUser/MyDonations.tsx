import React, { useEffect, useState } from "react";
import ProfilNavigation from "../../pages/ProfilNavigation";
import { Transaction, getDonsUser } from "../../api/apiService";
import "../../css/profil.css"; // Assurez-vous que le fichier CSS est importé

const MyDonations: React.FC = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getDonsUser(storedUser.adherent.id);
        if (response && response.Transactions) {
          setTransactions(response.Transactions);
        } else {
          console.log('Error fetching donations');
        }
      } catch (err) {
        console.log('Error fetching donations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [storedUser.adherent.id]);

  if (isLoading) {
    return (
      <>
      <br/>
      <br/>
      <center>
        <div className="loader">
          <div className="square-1 square"></div>
          <div className="square-2 square"></div>
        </div>
      </center>
      <ProfilNavigation />
      </>

    );
  }

  return (
    <div className="profile-container">
      <ProfilNavigation />
      <div className="profile-details">
        <h2>Mes dons</h2>
        <div className="donations-list">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="donation-item card">
                <p>Montant: {transaction.montant} €</p>
                <p>Type: {transaction.type}</p>
                <p>Méthode de paiement: {transaction.methodePaiement}</p>
              </div>
            ))
          ) : (
            <p>Aucun don trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;
