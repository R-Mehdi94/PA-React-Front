import { FunctionComponent } from "react"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import "../css/slider.css"; 

const Slider: FunctionComponent = () => {
    const datas = [
        {
            id: 1,
            title: 'slider 1',
            image: "../images/noie.jpg"
        },
        {
            id: 2,
            title: 'slider 2',
            image: "../images/conf.jpg"
        },
        {
            id: 3,
            title: 'slider 3',
            image: "../images/event.jpg"
        },
        {
            id: 4,
            title: 'slider 4',
            image: "../images/visa.jpg"
        }
    ]
    return (
        <Carousel>
            {datas.map(data => (
                <div key={data.id}>
                    <img src={data.image} alt={data.title} />
                </div>
            ))}
        </Carousel>
    )
}

export default Slider