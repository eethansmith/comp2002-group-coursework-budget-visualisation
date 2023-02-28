import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import RingChart from './ringchart';

test('Renders Daily view', async () => {
  render(<RingChart data={{}} isDaily={true} />);
  const textElement = screen.getByText(/Today/i);
  expect(textElement).toBeInTheDocument();
});

test('Renders Monthly view', async () => {
  render(<RingChart data={{}} isDaily={false} />);
  const textElement = screen.getByText(/This month/i);
  expect(textElement).toBeInTheDocument();
});
