import { IoClose } from 'react-icons/io5';
import {BsFillSquareFill} from 'react-icons/bs';


const ModalContents = (props) => {

    const rows = [];

    Object.keys(props.categoryData).forEach((key, index) => {

        let date = new Date(props.categoryData[index].date);
        rows.push(
            <>
            <p className="Date">{date.toLocaleDateString('default', {weekday: "long", day: 'numeric', month: 'short'})}</p>
            <div key={key} className="Row">
                <div>
                <p className='Merchant'>{props.categoryData[index].merchant}</p>
                <p className='Time'>{date.toLocaleTimeString('en', {timeStyle: "short"})}</p>
                </div>
                <p>{"£" + props.categoryData[index].amount}</p>
            </div>
            </>
        )
    });

    const handleClick = () => {
        props.setModalIsOpen(false);
    }

    return (
        <>
            <div className='TitleAndSquare'>
                <h3>{props.dataKey}</h3>
                <p className='ColorSquare'><BsFillSquareFill color={props.color}></BsFillSquareFill></p>
            </div>
            <div className='Stats'>
                <p className='Stat'>Spent: £{props.spent.toFixed(2)} </p>
                <p className='Stat Percent'>Percentage: {Math.round(props.percentage)}%</p>
            </div>
            <button className="Close" onClick={handleClick}> <IoClose></IoClose></button>
            <div className='Scrollable'>
                {rows}
            </div>
            
        </>
    )
}

export default ModalContents