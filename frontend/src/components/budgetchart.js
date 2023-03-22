
const BudgetChart = ((props) => {
    
    const HEIGHTWIDTH = 500;

    const salary = 0; //The output of the salary textbox

    const bars = [];
    const textBoxes = [];

    const axesStart = HEIGHTWIDTH/10 + (HEIGHTWIDTH/20)/2;
    const axesEnd = (9*HEIGHTWIDTH)/10 - (HEIGHTWIDTH/20)/2;
    
    const axesTotal = axesEnd - axesStart;

    // const barSpacingUtil = axesTotal/numOfBars
    // const barHeight = barSpacingUtil * 7/8

    
    // TODO: push a line be the "budget line"
        // we will use this line as the 100% point for the bars - i havent thought about this implementation yet

    // TODO: forms/text fields here -> theres a static number of them so it shouldnt be too bad.

    // TODO: Bar locations/dimensions
    // forEach category 
        // barWidth = (currentData/largestData) * TotalSpaceAllowedForBars * proportionOfAllowed
        // Ycoord(topLeft) = axesStart + ((index + 1/16) * barSpacingUtil )
        // Xcoord = constant, we'll figure it out when we test it a bit
        // push to bars array



    return (
        <>
            <svg className="budgetChart Chart" viewBox="0 0 500 500">
                {bars}
                {axis}
                {budgetLine}
            </svg>
        </>
    )
})

export default BudgetChart;