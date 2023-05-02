import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import BarChart from './barchart';

test('Renders Daily view ringchart', async () => {
    const {container} = render(<BarChart data={{}} isDaily={true} />);
    const textElement = screen.getByText(/Today/i);
    expect(textElement).toBeInTheDocument();
  });
  
  test('Renders Monthly view ringchart', async () => {
    const {container} = render(<BarChart data={{}} isDaily={false} />);
    const textElement = screen.getByText(/This month/i);
    expect(textElement).toBeInTheDocument();
  });