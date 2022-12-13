import logo from '../images/image_1_1.svg'
import '../stylesheets/Header.css'

const Header = (props)=> {

    const handleClick = () => {
        props.updateDaily(!props.isDaily);
    }

    return (
        <div class="frame">
            <img class="logo" src={logo}/>
            <button class={props.isDaily ? 'buttons selected' : 'buttons'} onClick={() => {handleClick()}}> Daily View </button>
            <button class={props.isDaily ? 'buttons' : 'buttons selected'} onClick={() => {handleClick()}}> Monthly View </button>

        </div>
    );
  };
export default Header