import logo from '../images/image_1_1.svg'
import '../stylesheets/Header.css'


const Header = (props)=> {
    return (
        <div class="frame">
            <img class="logo" src={logo}/>
            <button class="buttons"> Daily View </button>
            <button class="buttons"> Monthly View </button>

        </div>
    );
  };
export default Header