import { useEffect, useState } from 'react';
import './stylesheets/App.css';
import Chart from './components/chart'
import Header from './components/header'
import { IoSwapHorizontalOutline } from 'react-icons/io5'

const App = () => {

  const [isRingChart, setIsRingChart] = useState(true);
  const [isDaily, setDaily] = useState(true);
  const [data, setData] = useState({});

  const updateDaily = (bool) => {
    setDaily(bool);
  }

  // Fetch account transactions from backend
  // Requires, accountID, timeframe (daily, weekly, monthly)
  const fetchData = () => {
    var testAccountID = '30506983';
    return fetch ("http://localhost:4000/api/" + testAccountID + "/daily" + "/transactions")
    .then((response) => response.json())
    .then((data) => setData(data));
  }

  useEffect(() => {
    fetchData();
  },[])
  
  return (
    <>
      <Header updateDaily={updateDaily} isDaily={isDaily}></Header>
      {(JSON.stringify(data) === '{}') ? <></> : <button className="Swap" onClick={() => {setIsRingChart(!isRingChart)}}><IoSwapHorizontalOutline /></button>}
      <Chart isRingChart={isRingChart} data={data} isDaily={isDaily} height="500" width="500" />
    </>
  );
}

export default App;
