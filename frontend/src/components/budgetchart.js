import { useState } from 'react';


const BudgetChart = ((props) => {

    const [salary, setSalary] = useState(2050);
    const [billsPercentage, setBills] = useState(34);
    const [groceriesPercentage, setGroceries] = useState(33);
    const [otherPercentage, setOther] = useState(33);
    
    const HEIGHTWIDTH = 500;

    const regex = /[a-z]/gi;

    const bars = [];
    const yAxes = [];

    // All consts past this point should be fine tuned to make the image look better
    const axesStart = HEIGHTWIDTH/10 + (HEIGHTWIDTH/20)/2;
    const axesEnd = (9*HEIGHTWIDTH)/10 - (HEIGHTWIDTH/20)/2;

    
    let allowedBills = parseInt(billsPercentage);
    let allowedGroceries = parseInt(groceriesPercentage);
    let allowedOther = parseInt(otherPercentage);
    
    // All bars are going to appear in this range
    // axesStart is where the top of the top bar will start getting drawn at
    // axesEnd is where the bottom of the bars finish getting drawn
    // NOTE: There will usually be a sliver of empty space between the marker (e.g. axesStart) and the ends of a bar
    //       This is due to my personal desire (Dan) for the bars to appear about the exact centre of the axes
    const axesTotal = axesEnd - axesStart;

    // barSpacingUtil is the actual difference between the top left of the adjacent bars in the array
    const barSpacingUtil = axesTotal/4;

    // barHeight is the actual height of the bars 
    // In other words barSpacingUtil - barHeight = distance between bars
    // NOTE: The offset that centres the bars about the centre of the axes is half of (1 - this multiplier)
    //       Basically if you don't add that offset and have this as your barheight, the bars will be at that much of an offset
    //       To understand this intuitively draw out the maths of these bars yourself, I think there's actually a design of that
    //           for the barChart component in figma.
    const barHeight = barSpacingUtil*(7/8);

    //This is the height of the input box
    const inputBoxHeight = 25;

    //This is the width of the input box
    const inputBoxWidth = 45;

    // A static line that displays how much you've spent in comparison to how much you've planned to spend this month according to your salary
    const budgetLinePos = 0.7 * HEIGHTWIDTH;

    // Position of yAxis line (leftmost line that bars come from) relative to the size of the svg
    const yAxis = 0.1 * HEIGHTWIDTH;

    // Initial values for the budgeting of the categories as a proportion of the inputted salary
    const proportionsOfSalary = [0.4, 0.15, 0.3];

    // Distance between start of bar to the budget line, useful for the maths later
    const distanceToBudgetLine = budgetLinePos - yAxis;

    // Object to store values from the props
    let spendingDataObject = {Bills:0,Groceries:0,Other:0};

    Object.keys(spendingDataObject).forEach((key, index) => {
        if(props.data[key] !== undefined) {
            spendingDataObject[key] = props.data[key];
        }
    })

    // console.log(spendingDataObject); // Debug line to make sure the object is populated with data

    let spendingData = Object.values(spendingDataObject);

    // Next two "push" statements are pushing the budgetline and the startline from the data
    yAxes.push(
        <line 
            x1={yAxis}
            x2={yAxis}
            y1={axesStart}
            y2={axesEnd}
            stroke="black"
            strokeWidth="1"
        />
    )

    yAxes.push(
        <line 
            x1={budgetLinePos}
            x2={budgetLinePos}
            y1={axesStart}
            y2={axesEnd}
            stroke="black"
            strokeWidth="1"
            opacity="0.5"
            className="budgetLine"
        />
    )

    proportionsOfSalary[0] = (billsPercentage/100);
    proportionsOfSalary[1] = (groceriesPercentage/100);
    proportionsOfSalary[2] = (otherPercentage/100)

    // Drawing the bars to the chart
    Object.keys(spendingData).forEach((key,index) => {
        let pushedBarWidth = (spendingData[key]/(proportionsOfSalary[index] * salary)) * (distanceToBudgetLine);
        // The above line is some fun cool maths that figures out the proportion spent in comparison to the proportion budgeted
        // An example makes this clearer; if you wanted to spend half your salary on groceries, but ended up spending 75% on groceries instead,
        //     proportionally this is a 150% increase so the bar would span the distance to the budget line, and then half that same distance again.
        let colour = '#97CAEB';
        
        if(pushedBarWidth > distanceToBudgetLine) {
            colour = '#BF6C78';
        }


        
        bars.push(
        <rect 
            x={yAxis} // position of the leftmost point of the bar
            y={
                (barSpacingUtil*(index + 1/16)) + axesStart // position of the top of the bar
            }
            height={barHeight}
            width={pushedBarWidth}
            fill={colour}
        />
        )
    })


    // This variable and the forEach statement below it are here to calculate how much of the salary you've spent.
    let totalSpent = 0;

    Object.keys(spendingData).forEach((key, index) => {
        totalSpent += spendingData[key];
        // console.log(totalBudgeted);
    })

    // pushing the totalBar to the bars array
    // Basically displays the proportion spent in comparison to the user's salary
    bars.push(
        <rect
            key="Total"
            x={yAxis}
            y={
                (barSpacingUtil*(3 + 1/16)) + axesStart
            }
            height={barHeight}
            width={
                (totalSpent/salary) * (distanceToBudgetLine)
            }
            fill='#1C2640'
        />
    )

    return (
        <>
            <input
                type='text'
                min='0'
                value={salary}
                onChange={(e) => {
                    let result = e.target.value.replace(regex, '')
                    result = result < 0 ? 0 : result
                    if(result === NaN || result === "") {
                        result = 0;
                    } 
                    setSalary(parseInt(result));
                }}
            />

            <svg className="budgetChart Chart" viewBox="0 0 500 500">
                {bars}
                {yAxes}
                <foreignObject 
                    width={inputBoxWidth} 
                    height={inputBoxHeight} 
                    x={yAxis-50} 
                    y={(barSpacingUtil*(1/16)) + axesStart + (barHeight/2) - (inputBoxHeight/2)}
                >
                    <input
                        type='text'
                        min='0'
                        max='100'
                        value={billsPercentage}
                        onChange={(e) => {
                            allowedBills = 100 - (groceriesPercentage + otherPercentage);
                            allowedBills = (allowedBills < 0) ? 0 : allowedBills;
                            let result = e.target.value.replace(regex, '');
                            result = (result > allowedBills) ? allowedBills : result;
                            if(result === "") { result = 0; }
                            setBills(parseInt(result))
                        }}
                    />
                </foreignObject>
                <foreignObject 
                    width={inputBoxWidth} 
                    height={inputBoxHeight} 
                    x={yAxis-50} 
                    y={(barSpacingUtil*(17/16)) + axesStart + (barHeight/2) - (inputBoxHeight/2)}
                >
                    <input
                        type='text'
                        min='0'
                        max='100'
                        value={groceriesPercentage}
                        onChange={(e) => {
                            allowedGroceries = 100 - (billsPercentage + otherPercentage);
                            allowedGroceries = (allowedGroceries < 0) ? 0 : allowedGroceries;
                            let result = e.target.value.replace(regex, '')
                            result = (result > allowedGroceries) ? allowedGroceries : result
                            if(result === "") { result = 0; }
                            setGroceries(parseInt(result))
                        }}
                    />
                </foreignObject>
                <foreignObject 
                    width={inputBoxWidth} 
                    height={inputBoxHeight} 
                    x={yAxis-50} 
                    y={(barSpacingUtil*(33/16)) + axesStart + (barHeight/2) - (inputBoxHeight/2)}
                >
                    <input
                        type='text'
                        min='0'
                        max='100'
                        value={otherPercentage}
                        onChange={(e) => {
                            allowedOther = 100 - (groceriesPercentage + billsPercentage);
                            allowedOther = (allowedOther < 0) ? 0 : allowedOther;
                            let result = e.target.value.replace(regex, '')
                            result = (result > allowedOther) ? allowedOther : result
                            if(result === "") { result = 0; }
                            setOther(parseInt(result))
                        }}
                    />
                </foreignObject>
            </svg>
        </>
    )
})


export default BudgetChart;