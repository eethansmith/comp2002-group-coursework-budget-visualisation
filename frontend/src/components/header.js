import logo from '../images/image_1_1.svg'
import '../stylesheets/Header.css'

const Header = (props)=> {

    const handleClick = (bool, num) => {
        props.updateDaily(bool);
        props.setCurrentPage(num);
    }

    return (
        <div className="frame">
            <img className="logo" alt='Capital One Logo' src={logo}/>
            <button id={"daily"} className={(props.currentPage === 1) ? 'buttons selected' : 'buttons'} onClick={() => {handleClick(true, 1)}}> Daily View </button>
            <button id={"monthly"} className={(props.currentPage === 2) ? 'buttons selected' : 'buttons'} onClick={() => {handleClick(false, 2)}}> Monthly View </button>
            <button id={"budget view"} className={(props.currentPage === 3) ? 'buttons selected end' : 'buttons end'} onClick={() => {handleClick(props.isDaily, 3)}}> Budget View </button>
        </div>
    );
};
export default Header