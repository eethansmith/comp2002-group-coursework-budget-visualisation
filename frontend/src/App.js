import { useEffect, useState } from 'react';
import './stylesheets/App.css';
import Chart from './components/chart';
import BudgetChart from './components/budgetchart';
import Header from './components/header';
import DropDown from './components/dropdown';
import { IoSwapHorizontalOutline } from 'react-icons/io5'
import BarLoader from "react-spinners/BarLoader";


const App = () => {

  const [isRingChart, setIsRingChart] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDaily, setDaily] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [timestamp, setTimestamp] = useState(0);


  // Get the accountID from the URL
  const searchParams = new URLSearchParams(window.location.search);
  const accountID = searchParams.get("id");

  // Update timeframe
  const updateDaily = (bool) => {
    setDaily(bool);
  }

  // Fetch account transactions from backend
  // Requires accountID and timeframe
  // Parameters timeframe (daily, monthly)
  const fetchData = async (timeframe, timestamp) => {
    // Fetch the data
    setIsLoading(true);
    const response = await fetch("http://localhost:4000/api/transactions/" + accountID + "/"  + timestamp + "/" + timeframe);
    // If the response is not ok, return empty set
    if(!response.ok){
      setIsLoading(false);
      return setData({});
    }
    // Convert the response to JSON and return data
    const data = await response.json();
    setIsLoading(false);
    return setData(data);
  }

  // Fetch data on swap of isDaily
  useEffect(() => {
    // Make ringhchart the default
    setIsRingChart(true);
    // Fetch the data
    fetchData(isDaily ? "daily" : "monthly", timestamp);
  }, [isDaily, timestamp])
  
  return (
    <>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} updateDaily={updateDaily} isDaily={isDaily}></Header>
      
      {(currentPage !== 3) ?<DropDown setTimestamp={setTimestamp} isDaily={isDaily}></DropDown> : <></>}
      {(currentPage!== 3) ? ((JSON.stringify(data) === '{}') ? <></> : <button className="Swap" onClick={() => {setIsRingChart(!isRingChart)}}><IoSwapHorizontalOutline /></button>) : <></>}
      {(currentPage!== 3) ? ((isLoading === true)? <BarLoader className='Loader'></BarLoader> :<Chart isRingChart={isRingChart} data={data} isDaily={isDaily}/>) : <></>}
      {(currentPage === 3) ? <BudgetChart data={data}></BudgetChart> : <></>}
    </>
  );
}

export default App;
