import { useState } from "react";

const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']
let runningTotal = 0;

const RingChart = (props) => {

    const[currentSection, setCurrentSection] = useState("default");

    let dataAsPercentage = makeDataPercentage(props.data);

    const paths = [];

    const text = [
        <text key="text1" fontSize="0.15" textAnchor="middle" y="-0.2"> {currentSection} </text>,
        <text key="text2" fontSize="0.25" fontWeight="bold" textAnchor="middle" y="0.1"> £{(Math.round(props.data[currentSection] * 100) / 100).toFixed(2)} </text>,
        <text key="text3" fontSize="0.15" textAnchor="middle" y="0.3"> {props.isDaily ? "Today" : "This Month"} </text>
    ];

    const defaultText = [
        <text key="text1" fontSize="0.15" textAnchor="middle" y="-0.2"> Spent </text>,
        <text key="text2" fontSize="0.25" fontWeight="bold" textAnchor="middle" y="0.1"> £{totalSpent(props.data)} </text>,
        <text key="text3" fontSize="0.15" textAnchor="middle" y="0.3"> {props.isDaily ? "Today" : "This Month"} </text>
    ];

    Object.keys(dataAsPercentage).forEach((key, index) => (
        paths.push(
            <path onMouseOver={() => setCurrentSection(key)} onMouseLeave={() => setCurrentSection("default")} key={key} className="Section" d={getPath(dataAsPercentage[key])} stroke={colorPallete[index]} fill="transparent" strokeWidth="0.4"></path>
        )
    ))

    if(JSON.stringify(props.data) === '{}'){
        paths.push(
            <circle key="circle" r="1" fill="transparent" stroke="LightGray" strokeWidth="0.4"></circle>
        )
    }

    return (
        <>
            <svg className="ringChart Chart" height={props.height} width={props.width} viewBox="-1.25 -1.25 2.5 2.5">
                {paths}
                {(currentSection== "default") ? defaultText : text}
            </svg>
        </>
    );
}

function totalSpent(data) {
    return (Math.round(Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue, 0) * 100) / 100).toFixed(2);
}

function makeDataPercentage(data){

    const total = totalSpent(data);
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

    let greaterThan50 = (dataAsPercentage > 0.5) ? 1 : 0;

    let pathData = [
        "M " + startX + " " + startY,
        "A 1 1 0 " + greaterThan50 + " 1 " + endX + " " + endY,
    ].join(" ");

    return pathData;
}

export default RingChart;