import { useState } from "react";

const colorPallete = ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82', '#97CAEB', '#61A89A', '#37753B', '#312383']
let runningTotal = 0;

const RingChart = (props) => {

    const[currentSection, setCurrentSection] = useState("default");

    const getMonthAndYear = (timestamp) =>{
        let date = new Date(timestamp * 1);

        return date.toLocaleDateString('default',
            {month: 'short', year: 'numeric'});

    }   

    const getDayAndMonth = (timestamp) =>{
        let date = new Date(timestamp * 1);
        return date.toLocaleDateString('default',
            {day: 'numeric', month:'short'});
    }


    let dataAsPercentage = makeDataPercentage(props.data);

    let numSegments = 0;

    Object.keys(dataAsPercentage).forEach(() => ( numSegments++ ))

    const paths = [];

    const text = [
        <text key="text1" fontSize="0.15" textAnchor="middle" y="-0.2"> 
            {currentSection} 
        </text>,

        <text key="text2" fontSize="0.25" fontWeight="bold" textAnchor="middle" y="0.1"> 
            £{(Math.round(props.data[currentSection] * 100) / 100).toFixed(2)} 
        </text>,

        <text key="text3" fontSize="0.15" textAnchor="middle" y="0.3"> {props.isDaily ? getDayAndMonth(props.timestamp) : getMonthAndYear(props.timestamp)} </text>
    ];

    const defaultText = [
        <text key="text1" fontSize="0.15" textAnchor="middle" y="-0.2"> Spent </text>,

        <text key="text2" fontSize="0.25" fontWeight="bold" textAnchor="middle" y="0.1">
            £{totalSpent(props.data)} 
        </text>,
        
        <text key="text3" fontSize="0.15" textAnchor="middle" y="0.3"> {props.isDaily ? getDayAndMonth(props.timestamp) : getMonthAndYear(props.timestamp) } </text>
    ];

    if(numSegments === 1) {
        paths.push(
            <circle 
                key="circle" 
                r="1" 
                fill="transparent" 
                className="Section"
                stroke={colorPallete[0]}
                strokeWidth="0.4"
                onMouseOver={() => setCurrentSection(Object.keys(dataAsPercentage)[0])} 
                onMouseLeave={() => setCurrentSection("default")} 
                >
            </circle>
        )
    } else {
        Object.keys(dataAsPercentage).forEach((key, index) => (
            paths.push(
                <path 
                    onMouseOver={() => setCurrentSection(key)} 
                    onMouseLeave={() => setCurrentSection("default")} 
                    onMouseDown={() => {props.setModalIsOpen(true); props.setDataKey(key); props.setColor(colorPallete[index])}}
                    key={key} className="Section" 
                    d={getPath(dataAsPercentage[key])} 
                    stroke={colorPallete[index]} 
                    fill="transparent" 
                    strokeWidth="0.4"
                >
                </path>
            )
        ))
    }

    if(JSON.stringify(props.data) === '{}'){
        paths.push(
            <circle key="circle" r="1" fill="transparent" stroke="LightGray" strokeWidth="0.4"></circle>
        )
    }

    return (
        <>
            <svg className="ringChart Chart" viewBox="-1.25 -1.25 2.5 2.5">
                {paths}
                {(currentSection === "default") ? defaultText : text}
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
