import logo from '../images/image_1_1.svg'
import '../stylesheets/Header.css'

const Header = (props)=> {

    const handleClick = () => {
        props.updateDaily(!props.isDaily);
    }

    return (
        <div className="frame">
            <img className="logo" src={logo}/>
            <button className={props.isDaily ? 'buttons selected' : 'buttons'} onClick={() => {handleClick()}}> Daily View </button>
            <button className={props.isDaily ? 'buttons' : 'buttons selected'} onClick={() => {handleClick()}}> Monthly View </button>

        </div>
    );
  };
export default Header