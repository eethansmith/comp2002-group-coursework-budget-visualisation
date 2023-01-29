import { useEffect, useState } from 'react';
import './stylesheets/App.css';
import Chart from './components/chart'
import Header from './components/header'
import { IoSwapHorizontalOutline } from 'react-icons/io5'

const App = () => {

  const [isRingChart, setIsRingChart] = useState(true);
  const [isDaily, setDaily] = useState(true);
  const [data, setData] = useState({});

  // Update timeframe
  const updateDaily = (bool) => {
    setDaily(bool);
  }

  // Fetch random account from backend
  const fetchRandomAccount = async () => {
    const response = await fetch("http://localhost:4000/api/random/account");
    const account = await response.json();
    return account;
  }

  // Fetch account transactions from backend
  // Requires, accountID, timeframe (daily, monthly)
  const fetchData = async (accountID) => {
    // Fetch the data
    return fetch("http://localhost:4000/api/" + accountID + "/monthly/transactions")
    .then((response) => response.json())
    .then((data) => setData(data));
  }

  // Fetch random account and fetch the account transactions
  useEffect(() => {
    fetchRandomAccount().then((account) => fetchData(account.accountId));
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
