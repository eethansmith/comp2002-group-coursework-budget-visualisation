import BarChart from "./barchart"
import RingChart from "./ringchart"
import Legend from "./legend"

const Chart  = (props) => {

    const newProps = {...props};
    delete newProps.isRingChart;

    if(props.isRingChart){
        return <RingChart {...newProps}></RingChart>
    }
    else{
        return (
            <div className="BarChartParent">
                <BarChart {...newProps}></BarChart>
                <Legend {...newProps}></Legend>
            </div>
        );
    }
}

export default Chart;