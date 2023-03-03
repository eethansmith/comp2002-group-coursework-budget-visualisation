
const BudgetChart = ((props) => {
    
    const HEIGHTWIDTH = 500;

    const spendingData = getSpendingData(HEIGHTWIDTH, props.data);

    const bars = [];
    const textBoxes = [];
    


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

function getSpendingData(width, data) {
    const valuesArray = Object.values(data);
    const maxValue = Math.max(...valuesArray);
    const multiplier = height / maxValue;
    
    let temp = {};

    Object.keys(data).forEach((key, index)=> {
        temp[key] = data[key]*multiplier;
    })

    return temp;
}

export default BudgetChart;