const colorPallete = 
    ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82',
     '#97CAEB', '#61A89A', '#37753B', '#312383']

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
                x={(barSpacingUtil*(index + 1/16)) + axesStart + barWidth/2}
                y={HEIGHTWIDTH*(1 - 0.05)}
                textAnchor="middle"
                fontSize="20"
            >
                {index + 1}
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
    
    let yLabelValues = pushLines(maxValue);

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

    let lineOpacity = "1";

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
        lineOpacity = "0.3";
    })

    return lines;
}

function pushLines(maxValue) {

    let tempMaxVal = maxValue;
    let orderOfMagnitude = 0;
    let lineModifier = 1;

    const axesLabels = [];

    while( tempMaxVal > 10 ) {
        tempMaxVal = tempMaxVal / 10;
        orderOfMagnitude++;
    }

    const calcNumLines = (maxValue / (10 ** orderOfMagnitude));
    
    /*
        In the if statement below are the values that determine how many axes 
        can appear on the graph. These are values that could change later but 
        for the time being they work.

        I am using strictly less/greater than symbols as calcNumLines is unlikely to be
        a whole number.
    */
    if( calcNumLines > 7 ) {
        lineModifier *= 2;
    } else if ( calcNumLines < 2 ) {
        lineModifier *= 1/5;
    } else if ( calcNumLines < 3 ) {
        lineModifier *= 1/2;
    }

    let iterations = calcNumLines/lineModifier;
    const denominator = (10 ** orderOfMagnitude) * lineModifier;

    /* 
        The below if statement checks whether the difference between the 
        max value and the top axis value is greater than half of the 
        difference between axes.

        If it is, then it adds another axis line above the bars. This way the axes
        shouldn't ever go over the limits of the svg, and still provide a better 
        visualisation of the spending.
    */ 
    if ( (maxValue % denominator) / denominator > 0.5 ) {
        iterations++;
    }

    for (let i = 0; i < iterations; i++) {
        axesLabels.push(
            i * (lineModifier) * (10 ** (orderOfMagnitude))
        )
    }

    return axesLabels;

}

export default BarChart;