import BarChart from "./barchart"
import RingChart from "./ringchart"

const Chart  = (props) => {

    const newProps = {...props};
    delete newProps.isRingChart;

    if(props.isRingChart){
        return <RingChart {...newProps}></RingChart>
    }
    else{
        return <BarChart {...newProps}></BarChart>
    }
}

export default Chart;