import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarChart from './barchart';

describe('BarChart component', () => {
  const sampleData = {
    A: 100,
    B: 200,
    C: 300,
    D: 400,
  };

  test('renders the component without crashing', () => {
    render(<BarChart data={sampleData} />);
  });

  test('renders the correct number of bars', () => {
    render(<BarChart data={sampleData} />);
    const bars = screen.getAllByTestId('bar');
    expect(bars.length).toBe(Object.keys(sampleData).length);
  });
  
  test('renders the correct number of x labels', () => {
    render(<BarChart data={sampleData} />);
    const xLabels = screen.getAllByTestId('x-label');
    expect(xLabels.length).toBe(Object.keys(sampleData).length);
  });

  test('renders the correct y labels', () => {
    render(<BarChart data={sampleData} />);
    const maxValue = Math.max(...Object.values(sampleData));
    const yLabelValues = pushLines(maxValue);
    const yLabels = screen.getAllByText(value => yLabelValues.includes(Math.round((parseFloat(value) * 100) / 100)));
    expect(yLabels.length).toBe(yLabelValues.length);
  });
});

function pushLines(maxValue) {
  let tempMaxVal = maxValue;
  let orderOfMagnitude = 0;
  let lineModifier = 1;

  const axesLabels = [];

  while( tempMaxVal > 10 ) {
      tempMaxVal = tempMaxVal / 10;
      orderOfMagnitude++;
  }

  const calcNumLines = (maxValue / (10 ** orderOfMagnitude));

  if( calcNumLines > 7 ) {
      lineModifier *= 2;
  } else if ( calcNumLines < 2 ) {
      lineModifier *= 1/5;
  } else if ( calcNumLines < 3 ) {
      lineModifier *= 1/2;
  }

  let iterations = calcNumLines/lineModifier;
  const denominator = (10 ** orderOfMagnitude) * lineModifier;

  if ( (maxValue % denominator) / denominator > 0.5 ) {
      iterations++;
  }

  for (let i = 0; i < iterations; i++) {
      axesLabels.push(
          i * (lineModifier) * (10 ** (orderOfMagnitude))
      )
  }

  return axesLabels;
}