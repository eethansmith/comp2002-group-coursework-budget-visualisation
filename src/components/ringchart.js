const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']
let runningTotal = 0;

const RingChart = (props) => {

    let percData = makeDataPercentage(props.data);

    return (
        <>
            <svg height={props.height} width={props.width} viewBox="-1.5 -1.5 3 3">
                {percData.map((element, index) => (
                    <path key={index} {...createPathProps(element)} stroke={colorPallete[index]} strokeWidth="0.5"></path>
                ))}
            </svg>
        </>
    );
}


function makeDataPercentage(data){
    const total = data.reduce((accumulator, currentValue)=> accumulator + currentValue, 0);
    data.forEach((element, index) => {
        data[index] = (element / total);
    });
    return data;
}

function getCoordinates(percent) {
    let x = Math.cos(2 * Math.PI * percent);
    let y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function createPathProps(percentageData){
    let [startX, startY] = getCoordinates(runningTotal);
    runningTotal += percentageData;
    let [endX, endY] = getCoordinates(runningTotal);

    let greaterThan50 = (percentageData > 50) ? 1 : 0;

    let pathData = [
        "M " + startX + " " + startY,
        "A 1 1 0 " + greaterThan50 + " 1 " + endX + " " + endY,
    ].join(" ");

    return {"d": pathData, "fill": "transparent",}
}

export default RingChart;