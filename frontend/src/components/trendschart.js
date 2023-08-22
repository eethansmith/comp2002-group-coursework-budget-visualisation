import React, { useState, useEffect} from 'react';
import '../stylesheets/TrendsChart.css';
import BarGroup from './bargroup';
import _ from "lodash";

const TrendsChart = ({ yearTrendData}) => {
let barHeight = 30
const [categoriesData, setCategoriesData ] = useState([]);
const [merchantData, setMerchantData] = useState([]);
const [chartData, setChartData ] = useState([]);
const [showCategory, setShowCategory] = useState(true);
const numberOfSpendingCategories = 3;

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
  
    return [month, year].join('-');
  }

  const barChartData = [];

  const getChartDates = (mergedData) => {
    const now = new Date();

    if(barChartData.length < 12) {
      for ( let i=12; i>0; i--) {
        let newdate = now.setMonth(now.getMonth() - 1);
        barChartData.push({
          name: formatDate(newdate),
          value: 0
        })
      }
    }

    for (var a=0; a < barChartData.length; a++) {
      const matchingDates = mergedData.find((data) => data.date.includes(barChartData[a].name));
      barChartData[a].value = matchingDates ? matchingDates.amount : 0;
    }
    setChartData(barChartData.reverse())
  }

  const handleDataSorting = (array, sortDataBy, setData) => {
    const sortedData = array.reduce((obj, item) => {  
      let find = obj.find(i => i[sortDataBy] === item[sortDataBy]);
      let _d = {  
        amount: item.amount,
        category: item[`${sortDataBy}`],
      }
      find ? (find.amount += item.amount ) : obj.push(_d);
      return obj;
    }, [])
    const sortedByCategory = sortedData.sort(({amount:a}, {amount:b}) => b-a)
    setData(sortedByCategory);
  }
  

  const mergeData = (array) => { 
    const dataSortedByDate = array.reduce((obj, item) => {  
      let find = obj.find(i => i.date === item.date);  
      let _d = {  
        amount: item.amount,
        date: item.date,
      }
      find ? (find.amount += item.amount ) : obj.push(_d);
      return obj;
    }, [])
    getChartDates(dataSortedByDate);

    //sort data by category
    handleDataSorting(array, 'category', setCategoriesData);
    //sort data by date
    handleDataSorting(array, 'merchantName', setMerchantData);
  };

  const sortData = async () => {
    if(_.isEmpty(yearTrendData)){
      return;
    }else if(yearTrendData.length >= 1 && yearTrendData) {
      const sData = await yearTrendData.map(data => ({
        id: data._id,
        date: formatDate(data.date),
        amount: data.amount,
        category: data.merchant.category,
        merchantName: data.merchant.name
      }))
      mergeData(sData);
    }
    return;
  }

  useEffect(() => {
    sortData();
  }, [yearTrendData])

  return (
    <div className='trends-chart'>
      <div className='chart-parent'>
        <h3 className='trends-sub-title'>Your Spending This Past Year</h3>
        <svg width="800" height="520">
          <g className="container">
            <g className="chart" transform="translate(100,60)">
              {chartData.map((d, i) => (
                <g transform={`translate(0, ${i * barHeight})`} key={d.name}>
                  <BarGroup key={d.name} d={d} barHeight={barHeight} />
                </g>
              ))}
            </g>
            <text transform="rotate(90)" x="200" y="-20" className='trends-y-axis-label'>Date</text>
            <text x="300" y="440">Amount (£)</text>
          </g>
        </svg>
      </div>  
      <div className='trends-observables'>
        <div>
          <button 
            className={`trends-switch-button ${showCategory && "active"}`}
            onClick={() => setShowCategory(true)}
          >
           <p>Categories</p>
          </button>
          <button 
            className={`trends-switch-button ${showCategory !== true && "active"}`}
            onClick={() => setShowCategory(false)}
          >
           <p>Merchants</p>
          </button>
        </div>
        <h4>
          Your Top {numberOfSpendingCategories} {showCategory ? 'Spending Categories': 'Merchants To Spend With'} Are
        </h4>
        {showCategory ? <div className='spending-category-container'>
          {categoriesData.slice(0, numberOfSpendingCategories).map((d, i) => (
            <div key={i} className='spending-card'>
              <p><b>{d.category}</b></p>
              <p>£ {Math.round(d.amount)}</p>
            </div>
          ))}
        </div>
        :
        <div className='spending-category-container'>
          {merchantData.slice(0, numberOfSpendingCategories).map((d, i) => (
            <div key={i} className='spending-card'>
              <p><b>{d.category}</b></p>
              <p>£ {Math.round(d.amount)}</p>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
}

export default TrendsChart;
