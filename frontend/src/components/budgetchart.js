import { useState } from 'react';
import {AiFillCheckCircle, AiFillCloseCircle} from 'react-icons/ai';


const BudgetChart = ((props) => {

    // useState variable for the user to be able to dynamically change their salary.
    const [SALARY, setSalary] = useState(2050);

    const [BILLS_PECENTAGE, setBillsPercentage] = useState(40);
    const [GROCERIES_PERCENTAGE, setGroceriesPercentage] = useState(30);
    const [OTHER_PERCENTAGE, setOtherPercentage] = useState(30);
    
    // Converting the raw text data passed from the user input to numbers
    let allowedBills = parseInt(BILLS_PECENTAGE);
    let allowedGroceries = parseInt(GROCERIES_PERCENTAGE);
    let allowedOther = parseInt(OTHER_PERCENTAGE);
    
    // Height of SVG
    const HEIGHT = 500;
    // Width of SVG
    const WIDTH = 900;

    // This regex is here to only allow numbers to be entered into the text boxes of the salary
    // and category percentage boxes.
    const NUMBER_ONLY_REGEX = /[a-z]/gi;

    // Array to store the rectangles representing the "Bars" on the chart
    const BARS = [];

    // Array to store the leftmost vertical line representing the y-axis, and the vertical dashed line representing the budget line
    const VERT_LINES = [];

    // Array to store text elements that label the bars for the different spending categories
    const BAR_LABELS = [];

    // Array to store text elements that show the amount spent in comparison to how much the user has budgeted themselves.
    const SPENDING_PROPORTION_LABELS = [];

    // All consts past this point can be fine tuned to change the look of the image
    const START_OF_AXIS = HEIGHT/10 + (HEIGHT/20)/2;
    const END_OF_AXIS = (9*HEIGHT)/10 - (HEIGHT/20)/2;

    // All bars are going to appear in this range
    // AXES_START is where the top of the top bar will start getting drawn at
    // AXES_END is where the bottom of the bars finish getting drawn
    // NOTE: There will usually be a sliver of empty space between the marker (e.g. AXES_START) and the ends of a bar
    //       This is due to my personal desire (Dan) for the bars to appear about the exact centre of the axes
    const TOTAL_AXIS_LENGTH = END_OF_AXIS - START_OF_AXIS;

    // BAR_SPACING_UTIL is the actual difference between the top left of the adjacent bars in the array
    const BAR_SPACING_UTIL = TOTAL_AXIS_LENGTH/4;

    // BAR_HEIGHT is the actual height of the bars 
    // In other words BAR_SPACING_UTIL - BAR_HEIGHT = distance between bars
    // NOTE: The offset that centres the bars about the centre of the axes is half of (1 - this multiplier)
    //       Basically if you don't add that offset and have this as your barheight, the bars will be at that much of an offset
    //       To understand this intuitively draw out the maths of these bars yourself, I think there's actually a design of that
    //           for the barChart component in figma.
    const BAR_HEIGHT = BAR_SPACING_UTIL*(7/8);

    //This is the height of the input box
    const INPUT_HEIGHT = 25;

    //This is the width of the input box
    const INPUT_WIDTH = 30;


    // Position of yAxis line (leftmost line that bars come from) relative to the size of the svg
    const AXIS_Y_POS = 0.175 * WIDTH;

    // A static line that displays how much you've spent in comparison to how much you've planned to spend this month according to your salary
    // Use HEIGHT here to indicate that it is 0.7 * HEIGHT in relation to the y Axis line
    const BUDGET_LINE_POS = (0.7 * HEIGHT) + AXIS_Y_POS;

    // Initial values for the budgeting of the categories as a proportion of the inputted salary
    const INITIAL_CAT_PROPORTIONS = [0.4, 0.3, 0.3];

    // Distance between start of bar to the budget line, useful for the maths later
    const BUDGET_LINE_DISTANCE = BUDGET_LINE_POS - AXIS_Y_POS;

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
    VERT_LINES.push(
        <line 
            x1={AXIS_Y_POS}
            x2={AXIS_Y_POS}
            y1={START_OF_AXIS}
            y2={END_OF_AXIS}
            stroke="black"
            strokeWidth="1"
        />
    )

    VERT_LINES.push(
        <line 
            x1={BUDGET_LINE_POS}
            x2={BUDGET_LINE_POS}
            y1={START_OF_AXIS}
            y2={END_OF_AXIS}
            stroke="black"
            strokeWidth="1"
            strokeDasharray={12}
            opacity="0.8"
            className="budgetLine"
        />
    )
    
    // Storing the user-selected perecentages for the categories
    INITIAL_CAT_PROPORTIONS[0] = (BILLS_PECENTAGE/100);
    INITIAL_CAT_PROPORTIONS[1] = (GROCERIES_PERCENTAGE/100);
    INITIAL_CAT_PROPORTIONS[2] = (OTHER_PERCENTAGE/100)

    let pushedBarWidth = 0;
    let colour = 0;

    // Drawing the bars to the chart
    Object.keys(spendingData).forEach((key,index) => {

        pushedBarWidth = (spendingData[key]/(INITIAL_CAT_PROPORTIONS[index] * SALARY)) * (BUDGET_LINE_DISTANCE);
        // The above line is some fun cool maths that figures out the proportion spent in comparison to the proportion budgeted
        // An example makes this clearer; if you wanted to spend half your salary on groceries, but ended up spending 75% on groceries instead,
        //     proportionally this is a 150% increase so the bar would span the distance to the budget line, and then half that same distance again.
        colour = '#97CAEB';
    
        // If the spending exceeds the budget, that bar will change colour to be red
        if(pushedBarWidth > BUDGET_LINE_DISTANCE) {
            colour = '#BF6C78';
        }

        // If the spending exceeds a certain proportion of the budget, the bar will only display at a certain maximum length
        if(pushedBarWidth > BUDGET_LINE_DISTANCE * 1.4) {
            pushedBarWidth = BUDGET_LINE_DISTANCE * 1.4;
        }

        let barText = "";

        // Depending on the key (which is an integer), the text for the category will be decided
        switch(parseInt(key)) {
            case 0 : barText = "Bills"; break;
            case 1 : barText = "Groceries"; break;
            case 2 : barText = "Other"; break;
            default: barText = "ERROR";
        }

        // Pushing the category labels
        // Also pushing percentage symbols to make it clear that the user input is a percentage.
        BAR_LABELS.push(
        <>
        <text
            x="95"
            y={(index * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
            textAnchor='end'
        >
            {barText}:
        </text>
        <text x =  {108 + INPUT_WIDTH}
            y = {(index * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
            fontSize = "15"
        >
            %
        </text>
        </>
        )

        // Spending rounded to 0dp.
        let roundedSpending = Math.round(spendingData[key])

        // Labels to show actual spending against a concrete budget value that is calculated by salary * percentage of salary/100
        SPENDING_PROPORTION_LABELS.push(
            <>
            <text
                x={(BUDGET_LINE_POS * 1.4) + 88}
                y={(index * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
                textAnchor='end'
            >
                £{roundedSpending}
            </text>
            <text
                x={(BUDGET_LINE_POS * 1.4) + 90}
                y={(index * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
                textAnchor='centre'
            >
                /
            </text>
            <text
                x={(BUDGET_LINE_POS * 1.4) + 98}
                y={(index * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
                textAnchor='start'
            >
                £{SALARY * INITIAL_CAT_PROPORTIONS[index]}
            </text>
            {(pushedBarWidth > BUDGET_LINE_DISTANCE) ? 
                <AiFillCloseCircle color='red' 
                x={(BUDGET_LINE_POS * 1.4)+ 15}
                y={(index * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2)}
                />
                : 
                <AiFillCheckCircle
                x={(BUDGET_LINE_POS * 1.4)+ 15}
                y={(index * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2)}
                color='green'
                />
            }
            </>
        )
        
        // The actual bar, the logic of the maths is explained in more detail in barchart.js so have a look there, it's basically the same
        BARS.push(
        <rect 
            x={AXIS_Y_POS} // position of the leftmost point of the bar
            y={
                (BAR_SPACING_UTIL*(index + 1/16)) + START_OF_AXIS // position of the top of the bar
            }
            height={BAR_HEIGHT}
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

    // Determining the width of the total bar
    pushedBarWidth = (totalSpent/SALARY) * BUDGET_LINE_DISTANCE;

    // The colour logic here is the same as it was with the foreach above, if the total spending exceeds the user's salary, the bar changes colour
    // One thing to note is that the rest of the bars are different colours in both states
    colour = '#1C2640';

    if(pushedBarWidth > BUDGET_LINE_DISTANCE) {
        colour = '#7D2B54';
    }

    // Again, total spent in comparison to salary is not allowed to be that high, otherwise the bar length is capped at a specific distance
    if(pushedBarWidth > BUDGET_LINE_DISTANCE * 1.4) {
        pushedBarWidth = BUDGET_LINE_DISTANCE * 1.4;
    }

    // Pushing the total category bar label
    BAR_LABELS.push(
    <text
        x="140"
        y={(3 * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
        textAnchor='end'
    >
        Total:
    </text>
    )

    let roundedSpending = Math.round(totalSpent)

    // The total spent shown next to salary
    SPENDING_PROPORTION_LABELS.push(
        <>
            <text
                x={(BUDGET_LINE_POS * 1.4) + 88}
                y={(3 * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
                textAnchor='end'
            >
                £{roundedSpending}
            </text>
            <text
                x={(BUDGET_LINE_POS * 1.4) + 90}
                y={(3 * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
                textAnchor='centre'
            >
                /
            </text>
            <text
                x={(BUDGET_LINE_POS * 1.4) + 98}
                y={(3 * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2) + INPUT_HEIGHT/2}
                textAnchor='start'
            >
                £{SALARY}
            </text>
            {(pushedBarWidth > BUDGET_LINE_DISTANCE) ? 
                <AiFillCloseCircle color='red' 
                x={(BUDGET_LINE_POS * 1.4)+ 15}
                y={(3 * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2)}
                />
                : 
                <AiFillCheckCircle
                x={(BUDGET_LINE_POS * 1.4)+ 15}
                y={(3 * BAR_SPACING_UTIL) + START_OF_AXIS + (BAR_HEIGHT/2)}
                color='green'
                />
            }
        </>
    )

    // pushing the totalBar to the bars array
    // Basically displays the proportion spent in comparison to the user's salary
    BARS.push(
        
        <rect
            key="Total"
            x={AXIS_Y_POS}
            y={
                (BAR_SPACING_UTIL*(3 + 1/16)) + START_OF_AXIS
            }
            height={BAR_HEIGHT}
            width={pushedBarWidth}
            fill={colour}
        />
    )

    // variable to decide whether or not a warning is displayed that not every percentage point of the salary has been budgeted
    let showWarning = 'hidden';
    const PERCENTAGE_NOT_BUDGETED = 100 - (BILLS_PECENTAGE + GROCERIES_PERCENTAGE + OTHER_PERCENTAGE);

    if(PERCENTAGE_NOT_BUDGETED > 0) {
        showWarning = '';
    }

    // returning the component
    return (
        <>
            <input
                className="salaryInput"
                type='text'
                min='0'
                value={SALARY}
                onChange={(e) => {
                    let result = e.target.value.replace(NUMBER_ONLY_REGEX, '')
                    result = result < 0 ? 0 : result
                    if(isNaN(result) || result === "") {
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
                {BARS}
                {VERT_LINES}
                {BAR_LABELS}
                {SPENDING_PROPORTION_LABELS}
                <text
                    x={AXIS_Y_POS}
                    y={START_OF_AXIS - 10}
                    fill='#BF6C78'
                    visibility={showWarning}
                > 
                    Warning: {PERCENTAGE_NOT_BUDGETED}% of salary not budgeted. 
                </text>
                <text x={BUDGET_LINE_POS - 50} y={START_OF_AXIS - 10}> Over-Budget </text>
                <foreignObject 
                    width={INPUT_WIDTH} 
                    height={INPUT_HEIGHT} 
                    x={AXIS_Y_POS-55} 
                    y={(BAR_SPACING_UTIL*(1/16)) + START_OF_AXIS + (BAR_HEIGHT/2) - (INPUT_HEIGHT/2)}
                >
                    <input
                        type='text'
                        min='0'
                        max='100'
                        value={BILLS_PECENTAGE}
                        onChange={(e) => {
                            allowedBills = 100 - (GROCERIES_PERCENTAGE + OTHER_PERCENTAGE);
                            allowedBills = (allowedBills < 0) ? 0 : allowedBills;
                            let result = e.target.value.replace(NUMBER_ONLY_REGEX, '');
                            result = (result > allowedBills) ? allowedBills : result;
                            if(result === "") { result = 0; }
                            setBillsPercentage(parseInt(result))
                        }}
                    />
                </foreignObject>
                <foreignObject 
                    width={INPUT_WIDTH} 
                    height={INPUT_HEIGHT} 
                    x={AXIS_Y_POS-55} 
                    y={(BAR_SPACING_UTIL*(17/16)) + START_OF_AXIS + (BAR_HEIGHT/2) - (INPUT_HEIGHT/2)}
                >
                    <input
                        type='text'
                        min='0'
                        max='100'
                        value={GROCERIES_PERCENTAGE}
                        onChange={(e) => {
                            allowedGroceries = 100 - (BILLS_PECENTAGE + OTHER_PERCENTAGE);
                            allowedGroceries = (allowedGroceries < 0) ? 0 : allowedGroceries;
                            let result = e.target.value.replace(NUMBER_ONLY_REGEX, '')
                            result = (result > allowedGroceries) ? allowedGroceries : result
                            if(result === "") { result = 0; }
                            setGroceriesPercentage(parseInt(result))
                        }}
                    />
                </foreignObject>
                <foreignObject 
                    width={INPUT_WIDTH} 
                    height={INPUT_HEIGHT} 
                    x={AXIS_Y_POS-55} 
                    y={(BAR_SPACING_UTIL*(33/16)) + START_OF_AXIS + (BAR_HEIGHT/2) - (INPUT_HEIGHT/2)}
                >
                    <input
                        type='text'
                        min='0'
                        max='100'
                        value={OTHER_PERCENTAGE}
                        onChange={(e) => {
                            allowedOther = 100 - (GROCERIES_PERCENTAGE + BILLS_PECENTAGE);
                            allowedOther = (allowedOther < 0) ? 0 : allowedOther;
                            let result = e.target.value.replace(NUMBER_ONLY_REGEX, '')
                            result = (result > allowedOther) ? allowedOther : result
                            if(result === "") { result = 0; }
                            setOtherPercentage(parseInt(result))
                        }}
                    />
                </foreignObject>
            </svg>
        </>
    )
})


export default BudgetChart;
