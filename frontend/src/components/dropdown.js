const DropDown = (props) => {
    console.log(props);
    
    const options = [];

    Object.keys(props.data).forEach((key, index) => {
        options.push(<option key={index} value={props.data[key]}>{key}</option>)
    });

    return (
        <select size={5}>
            {options}
        </select>
    )
};

export default DropDown;