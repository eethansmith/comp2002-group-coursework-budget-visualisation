const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']
let runningTotal = 0;

const RingChart = (props) => {

    let dataAsPercentage = makeDataPercentage(props.data);

    const paths = [];

    Object.keys(dataAsPercentage).forEach((key, index) => (
        paths.push(
            <path key={key} d={getPath(dataAsPercentage[key])} stroke={colorPallete[index]} fill="transparent" strokeWidth="0.5"></path>
        )
    ))

    return (
        <>
            <svg className="ringChart" height={props.height} width={props.width} viewBox="-1.25 -1.25 2.5 2.5">
                {paths}
            </svg>
        </>
    );
}


function makeDataPercentage(data){

    const total = Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    let temp = {};
    Object.keys(data).forEach(key => {
        temp[key] = (data[key] / total);
    });
    return temp;
}

function getCoordinates(percent) {
    let x = Math.cos(2 * Math.PI * percent);
    let y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function getPath(dataAsPercentage){
    let [startX, startY] = getCoordinates(runningTotal);
    runningTotal += dataAsPercentage;
    let [endX, endY] = getCoordinates(runningTotal);

    let greaterThan50 = (dataAsPercentage > 50) ? 1 : 0;

    let pathData = [
        "M " + startX + " " + startY,
        "A 1 1 0 " + greaterThan50 + " 1 " + endX + " " + endY,
    ].join(" ");

    return pathData;
}

export default RingChart;