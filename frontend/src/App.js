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

  const fetchData = () => {
    return fetch ("http://localhost:4000/api/users")
    .then((response) => response.json())
    .then((data) => setData(data));
  }

  useEffect(() => {
    fetchData();
  },[])

  const chartSize = () => {
    let width = window.screen.width;
    let height = window.screen.height;
    return (height > width) ? (width * 0.75) : (width * 0.25)
  }
  
  return (
    <>
      <Header updateDaily={updateDaily} isDaily={isDaily}></Header>
      {(JSON.stringify(data) === '{}') ? <></> : <button className="Swap" onClick={() => {setIsRingChart(!isRingChart)}}><IoSwapHorizontalOutline /></button>}
      <Chart isRingChart={isRingChart} data={data} isDaily={isDaily} height={chartSize()} width={chartSize()} />
    </>
  );
}

export default App;
