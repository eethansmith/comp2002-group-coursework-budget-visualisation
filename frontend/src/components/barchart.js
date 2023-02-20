const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']

const BarChart = (props) => {

    const HEIGHTWIDTH = 500;

    const heightedData = getHeightData(HEIGHTWIDTH, props.data);
    
    const bars = [];
    const xLabels = [];
    const yLabels = getYLabelValues(HEIGHTWIDTH, props.data);
    const lines = getLines(HEIGHTWIDTH, props.data);
    
    const dataLen = Object.keys(props.data).length;

    // These two variables determine where along the axes the bars will 
    const axesStart = HEIGHTWIDTH/10 + (HEIGHTWIDTH/20)/2;
    const axesEnd = (9*HEIGHTWIDTH)/10 - (HEIGHTWIDTH/20)/2;

    const axesTotal = axesEnd - axesStart;

    // Pre-decided bar width and spacing based on axes width
    const barSpacingUtil = axesTotal/(dataLen);

    const barWidth = barSpacingUtil*7/8;

    Object.keys(props.data).forEach((key, index) => {
        bars.push(
            <rect 
                key={key} 
                width={barWidth} 
                height ={heightedData[key]*0.7} 
                x={
                    (barSpacingUtil*(index + 1/16)) + axesStart
                } 
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
    var yLabelValues = pushLines(maxValue);

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

function getLines(height, data) {
    const valuesArray = Object.values(data);
    const maxValue = Math.max(...valuesArray);
    const multiplier = height / maxValue;
    const lines = [];
    var yLabelValues = [];

    yLabelValues = pushLines(maxValue);

    var lineOpacity = "1";

    yLabelValues.forEach((value, index) => {

        if(value === 0) {
            lineOpacity = "1";
        }

        lines.push(
            <line
                key={index}
                x1={height/10}
                y1={height*(1 - 0.15) - value*multiplier*0.7}
                x2={9*height/10}
                y2={height*(1 - 0.15) - value*multiplier*0.7}
                stroke="black"
                strokeWidth="1"
                opacity = {lineOpacity}
            />
        )
        lineOpacity = "0.5";
    })

    return lines;
}

function pushLines(maxValue) {

    var temp = maxValue;
    var orderOfMagnitude = 0;

    const axesLabels = [];

    while( temp > 10 ) {
        temp = temp / 10;
        orderOfMagnitude++;
    }

    const numLines = maxValue / (10 ** orderOfMagnitude) + 1 ;

    for (var i = 0; i < numLines; i++) {
        axesLabels.push(
            i*(10 ** orderOfMagnitude)
        )
    }

    return axesLabels;

}

export default BarChart;