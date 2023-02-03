const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']

const BarChart = (props) => {

    const HEIGHTWIDTH = 500;

    const heightedData = getHeightData(HEIGHTWIDTH, props.data);
    
    const bars = [];
    const xLabels = [];
    const yLabels = getYLabelValues(HEIGHTWIDTH, props.data);
    const lines = getLines(HEIGHTWIDTH, props.data);
    
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
        xLabels.push(
            <text
                key={key}
                x={(HEIGHTWIDTH/dataLen)*index + (HEIGHTWIDTH/dataLen)/2}
                y={HEIGHTWIDTH*(1 - 0.05)}
                textAnchor="middle"
                fontSize="20"
            >
                {key}
            </text>
        )
    })

    return (
        <>
            <svg className="barChart Chart" viewBox="0 0 500 500">
                {bars}
                {xLabels}
                {yLabels}
                {lines}
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

function getYLabelValues(height, data){
    const valuesArray = Object.values(data);
    const maxValue = Math.max(...valuesArray);
    const multiplier = height / maxValue;
    const yLabels = [];
    const yLabelValues = [0, maxValue/4, maxValue/2, maxValue*3/4, maxValue];

    yLabelValues.forEach((value, index) => {
        yLabels.push(
            <text
                key={index}
                x={0}
                y={height*(1 - 0.15) - value*multiplier*0.7}
                textAnchor="begin"
                fontSize="20"
                dominantBaseline={"middle"}
            >
                {Math.round((value*100)/100)}
            </text>
        )
    })

    return yLabels;
}

function getLines(height, data){
    const valuesArray = Object.values(data);
    const maxValue = Math.max(...valuesArray);
    const multiplier = height / maxValue;
    const lines = [];
    const yLabelValues = [0, maxValue/4, maxValue/2, maxValue*3/4, maxValue];

    yLabelValues.forEach((value, index) => {
        lines.push(
            <line
                key={index}
                x1={height/10}
                y1={height*(1 - 0.15) - value*multiplier*0.7}
                x2={9*height/10}
                y2={height*(1 - 0.15) - value*multiplier*0.7}
                stroke="black"
                strokeWidth="1"
            />
        )
    })

    return lines;
}

export default BarChart;