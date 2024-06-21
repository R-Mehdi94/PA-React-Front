import { FunctionComponent } from "react"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import "../css/carrousel.css"; 


const Slider: FunctionComponent = () => {
    const url="https://raw.githubusercontent.com/mazounirayan/PA-React-Front/Mehdi/src/images/"
    const datas = [
        {
            id: 1,
            title: 'slider 1',
            image: `${url}noie.jpg`,
            text: "text 4"
        },
        {
            id: 2,
            title: 'slider 2',
            image: `${url}conf.jpg`,
            text: "text 4"
        },
        {
            id: 3,
            title: 'slider 3',
            image: `${url}event.jpg`,
            text: "text 4"

        },
        {
            id: 4,
            title: 'slider 4',
            image: `${url}visa.jpg`,
            text: "text 4"
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
