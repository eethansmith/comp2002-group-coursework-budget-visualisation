const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']

const BarChart = (props) => {

    const HEIGHTWIDTH = 500;

    const heightedData = getHeightData(HEIGHTWIDTH, props.data);
    
    const bars = []
    
    const dataLen = Object.keys(props.data).length;

    const barWidth = HEIGHTWIDTH/(dataLen*2);

    Object.keys(props.data).forEach((key, index) => {
        bars.push(
            <rect 
                key={key} 
                width={barWidth} 
                height ={heightedData[key]*0.7} 
                x={(barWidth)/2 + (HEIGHTWIDTH/dataLen)*index} 
                y={HEIGHTWIDTH*(1 - 0.15) - heightedData[key]*0.7} 
                fill={colorPallete[index]} 
            />
        )
    })

    return (
        <>
            <svg className="barChart Chart" viewBox="0 0 500 500">
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