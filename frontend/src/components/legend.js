const colorPallete = 
    ['#7D2B54', '#9E4B95', '#BF6C78', '#DACD82',
     '#97CAEB', '#61A89A', '#37753B', '#312383']

const Legend = (props) => {

    const items = [];

    const numItems = Object.keys(props.data).length;

    //make gap between items proportional to number of items in legend 
    // (i.e. if there are 8 items, the gap between each item is 1/8th of the height of the legend)
    Object.keys(props.data).forEach((key, index) => {
        items.push(
            <g key={key}>
                <rect 
                    width="40" 
                    height ="40" 
                    x={140}
                    y={index * (400 / numItems) + 60}
                    fill={colorPallete[index]} 
                />
                <text
                x={160}
                y={index * (400 / numItems) + 90}
                textAnchor="middle"
                fill="white"
                fontSize="30"  
                >
                    {index + 1}
                </text>
                <text
                    x={190}
                    y={index * (400 / numItems) + 90}
                    textAnchor="left"
                    fontSize="30"
                >
                    {key}
                </text>
            </g>
        )
    });

    return(
        <svg className="legend" viewBox="0 0 500 500">
            <text
                x={140}
                y={35}
                textAnchor="middle"
                fontSize="35"
                textDecoration="underline"
            >
                Legend
            </text>
            {items}
            {/* <rect
                width="500"
                height="500"
                fill="transparent"
                stroke="black"
                strokeWidth="10"
                >
            </rect> */}
        </svg>

    );

}

export default Legend