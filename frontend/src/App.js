import { useEffect, useState } from 'react';
import './stylesheets/App.css';
import Chart from './components/chart';
import BudgetChart from './components/budgetchart';
import TrendsChart from './components/trendschart';
import Header from './components/header';
import DropDown from './components/dropdown';
import ModalContents from './components/modalcontents';
import { IoSwapHorizontalOutline } from 'react-icons/io5';
import BarLoader from "react-spinners/BarLoader";
import Modal from 'react-modal';


const App = () => {

  const [isRingChart, setIsRingChart] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDaily, setDaily] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [yearTrendData, setYearTrendsData] = useState({})
  const [timestamp, setTimestamp] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dataKey, setDataKey] = useState("");
  const [color, setColor] = useState("#ffffff");


  // Get the accountID from the URL
  const searchParams = new URLSearchParams(window.location.search);
  const accountID = searchParams.get("id");

  // Update timeframe
  const updateDaily = (bool) => {
    setDaily(bool);
  }

  function totalSpent(data) {
    return (Math.round(Object.values(data).reduce((accumulator, currentValue) => accumulator + currentValue, 0) * 100) / 100).toFixed(2);
}

  // Fetch account transactions from backend
  // Requires accountID and timeframe
  // Parameters timeframe (daily, monthly)
  const fetchDailyMonthlyData = async (timeframe, timestamp) => {
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

  const fetchBudgetData = async ( timeframe, timestamp) => {
    // Fetch the data
    setIsLoading(true);
    const response = await fetch("http://localhost:4000/api/transactions/" + accountID + "/"  + timestamp + "/" + timeframe + "/all-sub");
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

  const fetchCategoryData = async ( timeframe, timestamp) => {
    setIsLoading(true);
    let safeDataKey = dataKey.replace(/ /g, "%20");
    const response = await fetch("http://localhost:4000/api/transactions/" + accountID + "/"  + timestamp + "/" + timeframe + "/" + safeDataKey);
    if(!response.ok){
      console.log("ERROR")
      return setCategoryData({});
    }
    const data = await response.json();
    setIsLoading(false);
    return setCategoryData(data);
  }

  const fetchThisYearsTrendsData = async () => {
    setIsLoading(true);
    const response =  await fetch(`http://localhost:4000/api/trends/${accountID}/`);
    if(!response.ok) {
      console.log("ERROR")
      return setYearTrendsData({});
    };
      const data = await response.json();
      setIsLoading(false);
      return setYearTrendsData(data);
  }
  
  

  // Fetch data on swap of isDaily
  useEffect(() => {
    // Make ringhchart the default
    setIsRingChart(true);
    // Fetch the data
    if(currentPage === 4) {
      fetchThisYearsTrendsData()
    }else if(currentPage !== 3){
      fetchDailyMonthlyData(isDaily ? "daily" : "monthly", timestamp);
    }else{
      fetchBudgetData(isDaily ? "daily" : "monthly", timestamp);
    }
  }, [isDaily, timestamp, currentPage])

  useEffect(() => {
    fetchCategoryData(isDaily ? "daily" : "monthly", timestamp);
  }, [dataKey, modalIsOpen])
  
  return (
    <>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} updateDaily={updateDaily} isDaily={isDaily}></Header>
      
      {currentPage !== 4 && <DropDown setTimestamp={setTimestamp} isDaily={isDaily}></DropDown>}
      {(currentPage!== 3 && currentPage !== 4) ? ((JSON.stringify(data) === '{}') ? <></> : <button className="Swap" onClick={() => {setIsRingChart(!isRingChart)}}><IoSwapHorizontalOutline /></button>) : <></>}
      {(currentPage!== 3 && currentPage !== 4) ? ((isLoading === true)? <BarLoader className='Loader'></BarLoader> : <Chart isRingChart={isRingChart} data={data} isDaily={isDaily} setModalIsOpen={setModalIsOpen} setDataKey={setDataKey} setColor={setColor} timestamp={timestamp}/>) : <></>}
      {(currentPage === 3 && currentPage !== 4) ? ((isLoading === true) ? <BarLoader className='Loader'></BarLoader> : <BudgetChart data={data}></BudgetChart> ) : <></>}
      {(currentPage === 4 && currentPage!== 3) ? ((isLoading === true) ? <BarLoader className='Loader'></BarLoader> : <TrendsChart yearTrendData={yearTrendData} /> ) : <></>}
      <Modal className={"Modal"} isOpen={modalIsOpen}>{(isLoading === true)? <BarLoader className='Loader'></BarLoader> : <ModalContents categoryData={categoryData} setModalIsOpen={setModalIsOpen} dataKey={dataKey} spent={data[dataKey]} percentage = {data[dataKey]/totalSpent(data) * 100} color={color}/>}</Modal>
    </>
  );
}

export default App;
