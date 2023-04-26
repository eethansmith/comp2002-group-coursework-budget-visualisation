import { useState } from 'react';
import {AiFillCheckCircle, AiFillCloseCircle} from 'react-icons/ai';


const BudgetChart = ((props) => {

    const [salary, setSalary] = useState(2050);
    const [billsPercentage, setBills] = useState(40);
    const [groceriesPercentage, setGroceries] = useState(15);
    const [otherPercentage, setOther] = useState(30);
    
    const HEIGHT = 500;
    const WIDTH = 900;

    const regex = /[a-z]/gi;

    const bars = [];
    const yAxes = [];
    const yLabels = [];
    const yLabels2 = [];

    // All consts past this point should be fine tuned to make the image look better
    const axesStart = HEIGHT/10 + (HEIGHT/20)/2;
    const axesEnd = (9*HEIGHT)/10 - (HEIGHT/20)/2;
    
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
    const inputBoxWidth = 30;


    // Position of yAxis line (leftmost line that bars come from) relative to the size of the svg
    const yAxis = 0.175 * WIDTH;

    // A static line that displays how much you've spent in comparison to how much you've planned to spend this month according to your salary
    // Use HEIGHT here to indicate that it is 0.7 * HEIGHT in relation to the y Axis line
    const budgetLinePos = (0.7 * HEIGHT) + yAxis;

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
            strokeDasharray={12}
            opacity="0.8"
            className="budgetLine"
        />
    )

    proportionsOfSalary[0] = (billsPercentage/100);
    proportionsOfSalary[1] = (groceriesPercentage/100);
    proportionsOfSalary[2] = (otherPercentage/100)

    let pushedBarWidth = 0;
    let colour = 0;

    // Drawing the bars to the chart
    Object.keys(spendingData).forEach((key,index) => {
        pushedBarWidth = (spendingData[key]/(proportionsOfSalary[index] * salary)) * (distanceToBudgetLine);
        // The above line is some fun cool maths that figures out the proportion spent in comparison to the proportion budgeted
        // An example makes this clearer; if you wanted to spend half your salary on groceries, but ended up spending 75% on groceries instead,
        //     proportionally this is a 150% increase so the bar would span the distance to the budget line, and then half that same distance again.
        colour = '#97CAEB';
    
        if(pushedBarWidth > distanceToBudgetLine) {
            colour = '#BF6C78';
        }

        if(pushedBarWidth > distanceToBudgetLine * 1.4) {
            pushedBarWidth = distanceToBudgetLine * 1.4;
        }

        let barText = "";

        switch(parseInt(key)) {
            case 0 : barText = "Bills"; break;
            case 1 : barText = "Groceries"; break;
            case 2 : barText = "Other"; break;
            default: barText = "ERROR";
        }


        yLabels.push(
        <>
        <text
            x="95"
            y={(index * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
            textAnchor='end'
        >
            {barText}:
        </text>
        <text x =  {108 + inputBoxWidth}
            y = {(index * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
            fontSize = "15"
        >
            %
        </text>
        </>
        )

        let roundedSpending = Math.round(spendingData[key])

        yLabels2.push(
            <>
            <text
                x={(budgetLinePos * 1.4) + 88}
                y={(index * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
                textAnchor='end'
            >
                £{roundedSpending}
            </text>
            <text
                x={(budgetLinePos * 1.4) + 90}
                y={(index * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
                textAnchor='centre'
            >
                /
            </text>
            <text
                x={(budgetLinePos * 1.4) + 98}
                y={(index * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
                textAnchor='start'
            >
                £{salary * proportionsOfSalary[index]}
            </text>
            {(pushedBarWidth > distanceToBudgetLine) ? 
                <AiFillCloseCircle color='red' 
                x={(budgetLinePos * 1.4)+ 15}
                y={(index * barSpacingUtil) + axesStart + (barHeight/2)}
                />
                : 
                <AiFillCheckCircle
                x={(budgetLinePos * 1.4)+ 15}
                y={(index * barSpacingUtil) + axesStart + (barHeight/2)}
                color='green'
                />
            }
            </>
        )
        
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

    pushedBarWidth = (totalSpent/salary) * distanceToBudgetLine;
        
    colour = '#1C2640';

    if(pushedBarWidth > distanceToBudgetLine) {
        colour = '#7D2B54';
    }

    if(pushedBarWidth > distanceToBudgetLine * 1.4) {
        pushedBarWidth = distanceToBudgetLine * 1.4;
    }


    yLabels.push(
    <text
        x="140"
        y={(3 * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
        textAnchor='end'
    >
        Total:
    </text>
    )
    
    let roundedSpending = Math.round(totalSpent)

    yLabels2.push(
        <>
            <text
                x={(budgetLinePos * 1.4) + 88}
                y={(3 * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
                textAnchor='end'
            >
                £{roundedSpending}
            </text>
            <text
                x={(budgetLinePos * 1.4) + 90}
                y={(3 * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
                textAnchor='centre'
            >
                /
            </text>
            <text
                x={(budgetLinePos * 1.4) + 98}
                y={(3 * barSpacingUtil) + axesStart + (barHeight/2) + inputBoxHeight/2}
                textAnchor='start'
            >
                £{salary}
            </text>
            {(pushedBarWidth > distanceToBudgetLine) ? 
                <AiFillCloseCircle color='red' 
                x={(budgetLinePos * 1.4)+ 15}
                y={(3 * barSpacingUtil) + axesStart + (barHeight/2)}
                />
                : 
                <AiFillCheckCircle
                x={(budgetLinePos * 1.4)+ 15}
                y={(3 * barSpacingUtil) + axesStart + (barHeight/2)}
                color='green'
                />
            }
        </>
    )

    bars.push(
        
        <rect
            key="Total"
            x={yAxis}
            y={
                (barSpacingUtil*(3 + 1/16)) + axesStart
            }
            height={barHeight}
            width={pushedBarWidth}
            fill={colour}
        />
    )

    return (
        <>
            <input
                className="salaryInput"
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
            ></input>
            <p className='salaryLabel'>
                Monthly Income:
            </p>
            <p className='poundSign'>
                £
            </p>
            <svg className="budgetChart Chart" viewBox="0 0 900 500">
                {bars}
                {yAxes}
                {yLabels}
                {yLabels2}
                <text x={budgetLinePos - 50} y={axesStart - 10}> Over-Budget </text>
                <foreignObject 
                    width={inputBoxWidth} 
                    height={inputBoxHeight} 
                    x={yAxis-55} 
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
                    x={yAxis-55} 
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
                    x={yAxis-55} 
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