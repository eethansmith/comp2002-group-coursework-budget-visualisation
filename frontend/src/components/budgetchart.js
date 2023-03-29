

const BudgetChart = ((props) => {
    
    const HEIGHTWIDTH = 500;

    const salary = 2050; //The output of the salary textbox

    const bars = [];
    const yAxes = [];

    // All consts past this point should be fine tuned to make the image look better
    const axesStart = HEIGHTWIDTH/10 + (HEIGHTWIDTH/20)/2;
    const axesEnd = (9*HEIGHTWIDTH)/10 - (HEIGHTWIDTH/20)/2;
    
    const axesTotal = axesEnd - axesStart;

    const barSpacingUtil = axesTotal/4;
    const barHeight = barSpacingUtil*(7/8);

    const budgetLinePos = 0.7 * HEIGHTWIDTH;
    const yAxis = 0.1 * HEIGHTWIDTH;

    const proportionsOfSalary = [0.4, 0.15, 0.3];

    const distanceToBudgetLine = budgetLinePos - yAxis;

    let spendingDataObject = {Bills:0,Groceries:0,Other:0};

    Object.keys(spendingDataObject).forEach((key, index) => {
        if(props.data[key] != undefined) {
            spendingDataObject[key] = props.data[key];
        }
    })

    console.log(spendingDataObject);
    let spendingData = Object.values(spendingDataObject);

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
    
    // TODO: push a line be the "budget line"
        // we will use this line as the 100% point for the bars - i havent thought about this implementation yet

    // TODO: forms/text fields here -> theres a static number of them so it shouldnt be too bad.

    // TODO: Bar locations/dimensions
    // forEach category 
        // barWidth = ???
        // Xcoord = yAxis
        // Ycoord(topLeft) = axesStart + ((index + 1/16) * barSpacingUtil )
        // push to bars array


    Object.keys(spendingData).forEach((key,index) => {
        bars.push(
         <rect 
            x={yAxis}
            y={
                (barSpacingUtil*(index + 1/16)) + axesStart
            }
            height={barHeight}
            width={
                (spendingData[key]/(proportionsOfSalary[index] * salary)) * (distanceToBudgetLine)
            }
            fill='#97CAEB'
         />
        )
    })

    let totalBudgeted = 0;

    Object.keys(spendingData).forEach((key, index) => {
        totalBudgeted += spendingData[key];
        console.log(totalBudgeted);
    })

    bars.push(
        <rect
            key="Total"
            x={yAxis}
            y={
                (barSpacingUtil*(3 + 1/16)) + axesStart
            }
            height={barHeight}
            width={
                (totalBudgeted/salary) * (distanceToBudgetLine)
            }
            fill='#1C2640'
        />
    )

    return (
        <> 
            <svg className="budgetChart Chart" viewBox="0 0 500 500">
                {bars}
                {yAxes}
            </svg>
        </>
    )
})

export default BudgetChart;