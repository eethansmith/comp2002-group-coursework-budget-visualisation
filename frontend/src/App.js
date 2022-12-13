import { useState } from 'react';
import './stylesheets/App.css';
import Chart from './components/chart'
import Header from './components/header'
import { IoSwapHorizontalOutline } from 'react-icons/io5'

const App = () => {

  const [isRingChart, setIsRingChart] = useState(0);
  const[isDaily, setDaily] = useState(true);

  const updateDaily = (bool) => {
    setDaily(bool);
  }

  const dailyObject = {Groceries:12, Transport:13 ,Entertainment:4, Other:6}
  const monthlyObject = {Groceries:72, Transport:30 ,Entertainment:64, Other:100}

  
  return (
    <>
      <Header updateDaily={updateDaily} isDaily={isDaily}></Header>
      <button class="Swap" onClick={() => {setIsRingChart(!isRingChart)}}><IoSwapHorizontalOutline /></button>
      <Chart isRingChart={isRingChart} data={isDaily ? dailyObject: monthlyObject} height="500" width="500" />
    </>
  );
}

export default App;
