const DropDown = (props) => {
    
    return (
        <select size={5}>
            {Object.keys(props.data).forEach((key, index) => {
                <option key={index} value={key}>{props.data[key]}</option>
            })}
        </select>
    )
};

export default DropDown;