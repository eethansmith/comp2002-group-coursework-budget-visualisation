import { useEffect } from "react";

const DropDown = (props) => {
  
    //get an object of all the months in the current year with key as the month and value as unix timestamp
    const months = () => {
        let object = {};
        for(let i = 0; i < 12; i++){
            let date = new Date(), y = date.getFullYear(), m = date.getMonth();
            let timestamp = new Date(y, m-i, 1);
            let key = timestamp.toLocaleDateString('default', {month: 'short', year: 'numeric'});
            object[key] = timestamp.getTime();
        }
        return object;
    }

    //get an object of all the days in the current month with key as the day of the month 
    //and value as unix timestamp
    const days = () => {
        let object = {};
        let date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        let daysInMonth = new Date(y, m+1, 0).getDate();
        for(let i = 0; i < daysInMonth; i++){
            let timestamp = new Date(y, m, i+1);
            let key = timestamp.toLocaleDateString('default', {day: 'numeric', month:'short'});
            if(timestamp.getDate() <= d)  object[key] = timestamp.getTime();
        }
        return object;
    }
    
    const options = [];

    const data = props.isDaily ? days() : months();

    Object.keys(data).forEach((key, index) => {
        options.push(<option key={index} value={data[key]}>{key}</option>)
    });

    const handleChange = (timestamp) => {
        props.setTimestamp(timestamp);
    }

    //get the value of the currently selected option and run handleChange on it
    useEffect(() => {
        const dropdown = document.querySelector('.Dropdown');
        handleChange(dropdown.value);
    }, [data])

    return (
        <select onChange={e => handleChange(e.target.value)} className="Dropdown">
            {options}
        </select>
    )
};

export default DropDown;