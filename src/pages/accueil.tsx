import { FunctionComponent } from "react"
import Slider from '../components/Slider.tsx'
import '../css/accueil.css'
const Accueil: FunctionComponent = () => {
    return(
        <>
            <Slider/> 

            <div className="header">
                <ul className="header-ul">
                    <li>
                        <img width={70} src="https://raw.githubusercontent.com/mazounirayan/PA-React-Front/Mehdi/src/images/mission.png" alt="image" />
                        <h2>NOTRE MISSION</h2>
                        <p>Agir en proximité et avec valeur ajoutée pour accompagner les ECAF, depuis leur arrivée en France, pendant leur parcours et même lors de leur éventuel retour en Algérie.</p>
                    </li>
                    <li>
                        <img width={70} src="https://raw.githubusercontent.com/mazounirayan/PA-React-Front/Mehdi/src/images/valeur.png" alt="image" />
                        <h2>NOS VALEURS</h2>
                        <p>
                            Proximité
                            Ouverture
                            Valeur ajoutée
                        </p>
                    </li>
                    <li>
                        <img width={70} src="https://raw.githubusercontent.com/mazounirayan/PA-React-Front/Mehdi/src/images/vision.png" alt="image" />
                        <h2>NOTRE VISION</h2>
                        <p>Nous sommes présents dans toutes les régions de France, partenaire de cinq belles initiatives algériennes à travers le monde et acteur dans le transfert des compétences vers notre pays.</p>
                    </li>
                    <li>
                        <img width={70} src="https://raw.githubusercontent.com/mazounirayan/PA-React-Front/Mehdi/src/images/action.png" alt="image" />
                        <h2>NOS ACTIONS</h2>
                        <p>Permanences | Ateliers | Coaching | Rencontres Networking | Conférences | Salons | Culture | Sorties Détente | Excursions</p>
                    </li>

                </ul>
            </div>

            <div className="partietext">
                <h1>ECAF : hier, aujourd’hui et demain !</h1>

                <p>CAF est une jeune association créée par des étudiants et des cadres, nés et grandis en Algérie et qui ont choisi de tenter leur chance en France.. pour se développer, pour s’améliorer, pour découvrir de nouveaux horizons. L’idée de quitter l’Algérie pour aller ailleurs peut paraître amusante, mais cette aventure n’est pas une belle excursion touristique, c’est un vrai parcours de combattant !</p>

                <p>C‘est un départ à zéro, on cherche à satisfaire ses besoins en partant du niveau bas de la pyramide de Maslow. Où dormir ? Quoi manger ? … Questions qui n’ont jamais été posées étant chez-soi en Algérie, deviennent la priorité numéro un… En escaladant cette pyramide, en se stabilisant petit à petit, en progressant dans son parcours,.. on commence à penser à ceux qui sont là, à ses côtés, et qui sont en train de refaire le même parcours, ses compatriotes. Ceux qui ont besoin d’être accueillis, informés, orientés, accompagnés, soutenus,…</p>

                <p>Agir pour leur faciliter la vie ou leur apporter ne serait-ce qu’une simple information, peut-on se demander ! On est tous passé par les mêmes expériences, pièges, échecs et réussites… Telle est notre association, elle est née avec cette idée, il y a maintenant trois ans. Aujourd’hui, elle compte plus d’une centaine de bénévoles mobilisés pour vous. Elle compte également plus de 18 milles fans sur notre page facebook. Elle grandit vite, trop vite même !</p>

                <p>Face à ce vécu quotidien, nous n’avons pas oublié notre devenir, nous y avons pensé dès le début ! Notre projet ultime est « Dz Brains ». Ces cerveaux Algériens répartis partout dans le monde, il faut les mobiliser pour la bonne cause : « développer notre chère Algérie ». Nous l’avons quittée mais ne l’avons pas oubliée, nous ferons tout pour lui rendre ce qu’elle nous a donné. Nous y reviendrons un jour plus forts et avec valeur ajoutée !</p>
            </div>

        </>
    )}

export default Accueil