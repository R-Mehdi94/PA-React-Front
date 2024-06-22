import { FunctionComponent } from "react"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import "../css/carrousel.css"; 


const Slider: FunctionComponent = () => {
    const url="https://raw.githubusercontent.com/mazounirayan/PA-React-Front/Mehdi/src/images/"
    const datas = [
        {
            id: 1,
            title: 'Commémoration 11 Octobre 1961',
            image: `${url}noie.jpg`,
            text: 'ECAF organise la diffusion du film "ICI ON NOIE LES ALGERIENS", suivi par un Buffet et échange libre entre participants. Inscription obligatoire.'
        },
        {
            id: 2,
            title: 'Pont avec l\'Algérie',
            image: `${url}conf.jpg`,
            text: "En collaboration avec nos partenaires, nous vous aidons à préparer votre retour en Algérie."
        },
        {
            id: 3,
            title: 'Event Vélo 3 eme édition !',
            image: `${url}event.jpg`,
            text: "Venez nombreux à notre événement annuel de vélo, pour une bonne cause !"

        },
        {
            id: 4,
            title: 'Accueil des Nouveaux Arrivants',
            image: `${url}visa.jpg`,
            text: "L’association accompagne les étudiants dès l’obtention de leur visa, et en partenariat avec “Campus France Algérie“, elle organise à chaque rentrée universitaire une série de permanences d’accueil, d’information et d’orientation pour les des nouveaux arrivants."
        }
    ]
    return (
        <div className="carousel-container">
            <Carousel className="carousel" autoPlay interval={6000} infiniteLoop thumbWidth={120} showIndicators={false} showStatus={false}> 
                {datas.map(data => (
                    <div key={data.id}>
                        <img src={data.image} alt={data.title} />
                        <div className="overlay">
                            <h2 className="overlay_title">{data.title}</h2>
                            <p className="overlay_text">{data.text}</p>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default Slider
