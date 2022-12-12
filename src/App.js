import { useState } from 'react';
import './stylesheets/App.css';
import Chart from './components/chart'
import Header from './components/header'
import { IoSwapHorizontalOutline } from 'react-icons/io5'

const App = () => {

  const [isRingChart, setIsRingChart] = useState(0)


  return (
    <>
      <Header></Header>
      <button onClick={() => {setIsRingChart(!isRingChart)}}><IoSwapHorizontalOutline /></button>
      <Chart isRingChart={isRingChart} data={{Groceries:12, Transport:13 ,Entertainment:4, Other:6}} height="200" width="200" />
    </>
  );
}

export default App;
