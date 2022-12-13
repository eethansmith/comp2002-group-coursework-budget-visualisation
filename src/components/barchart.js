const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']

const BarChart = (props) => {

    const heightedData = getHeightData(props.height, props.data);
    const bars = []

    const dataLen = Object.keys(props.data).length;

    Object.keys(props.data).forEach((key, index) => {
        bars.push(
            <rect 
                key={key} 
                width={props.width/(dataLen*2)} 
                height ={heightedData[key]} 
                x={props.width/dataLen*index} 
                y = {props.height - heightedData[key]}
                fill={colorPallete[index]}
            />
        )
    })

    return (
        <>
            <svg className="barChart Chart" height={props.height} width={props.width}>
                {bars}
            </svg>
        </>
    );
}


function getHeightData(height, data){
    const valuesArray = Object.values(data);
    const maxValue = Math.max(...valuesArray);
    const multiplier = height / maxValue;
    
    let temp = {};

    Object.keys(data).forEach((key, index)=> {
        temp[key] = data[key]*multiplier;
    })

    return temp;
}

export default BarChart;