import { useEffect, useState } from 'react';
import './stylesheets/App.css';
import Chart from './components/chart'
import Header from './components/header'
import DropDown from './components/dropdown';
import { IoSwapHorizontalOutline } from 'react-icons/io5'
import BarLoader from "react-spinners/BarLoader";

const App = () => {

  const [isRingChart, setIsRingChart] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDaily, setDaily] = useState(true);
  const [data, setData] = useState({});


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
  const fetchData = async (timeframe) => {
    // Fetch the data
    setIsLoading(true);
    const response = await fetch("http://localhost:4000/api/" + accountID + "/" + timeframe + "/transactions");
    // If the response is not ok, return empty set
    if(!response.ok){
      return setData({});
    }
    // Convert the response to JSON and return data
    const data = await response.json();
    setIsLoading(false);
    return setData(data);
  }

  // Fetch data on swap of isDaily
  useEffect(() => {
    fetchData(isDaily ? "daily" : "monthly");
  }, [isDaily])
  
  return (
    <>
      <Header updateDaily={updateDaily} isDaily={isDaily}></Header>
      <DropDown isDaily={isDaily}></DropDown>
      {(JSON.stringify(data) === '{}') ? <></> : <button className="Swap" onClick={() => {setIsRingChart(!isRingChart)}}><IoSwapHorizontalOutline /></button>}
      {(isLoading === true)? <BarLoader className='Loader'></BarLoader> :<Chart isRingChart={isRingChart} data={data} isDaily={isDaily} height="500" width="500" />}
    </>
  );
}

export default App;
