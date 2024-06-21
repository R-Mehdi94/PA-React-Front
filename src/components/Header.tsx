import { FunctionComponent } from 'react';
import { Link } from 'react-scroll';

const Header: FunctionComponent = () =>{
    return (
    <div id='accueil'>
      <div className='name'>
        <h2><span>Osez</span> l'aventure, </h2>
        <h2><span>défiez</span> le mystère</h2>
        <div className='header-btns'>
          <Link to='Booking' className='header-btn' smooth={true} duration={1000}>Reservez</Link>
        </div>  
      </div>
    </div>
  );
}

export default Header;