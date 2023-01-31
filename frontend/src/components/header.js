import logo from '../images/image_1_1.svg'
import '../stylesheets/Header.css'

const Header = (props)=> {

    const handleClick = (bool) => {
        props.updateDaily(bool);
    }

    return (
        <div className="frame">
            <img className="logo" alt='Capital One Logo' src={logo}/>
            <button className={props.isDaily ? 'buttons selected' : 'buttons'} onClick={() => {handleClick(true)}}> Daily View </button>
            <button className={props.isDaily ? 'buttons end' : 'buttons selected end'} onClick={() => {handleClick(false)}}> Monthly View </button>

        </div>
    );
  };
export default Header