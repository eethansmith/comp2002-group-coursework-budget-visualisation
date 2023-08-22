import React, { useEffect, useState } from 'react'

const BarGroup = (props) => {
  const [dividedBy, setDividedBy] = useState(25)
  let barPadding = 2
  let barColour = '#348AA7'
  let widthScale = d => d * 10
  
  let width = widthScale(props.d.value)
  let yMid = props.barHeight * 0.5

  const handleWindowDimentions = () => {
    let num;
    if(window.innerWidth < 850) {
        num = 25 * (850/window.innerWidth) * 2;
        setDividedBy(num);
    } else if (window.innerWidth < 450) {
        num = 25 * (850/window.innerWidth) * 3;
        setDividedBy(num);
    }
  }

  useEffect(() => {
    handleWindowDimentions();
  }, []);

  return (
    <g className="bar-group">
      <text className="name-label" x="6" y={yMid} alignmentBaseline="middle" >{props.d.name}</text>
      <rect x={12} y={barPadding * 0.5} width={width/dividedBy} height={props.barHeight - barPadding} fill={barColour} />
      {props.d.value !== 0 && <text className="value-label" x={(width - 200)/dividedBy} y={yMid} alignmentBaseline="middle" >{Math.round(props.d.value)}</text>}
    </g>
  )
}

export default BarGroup;
