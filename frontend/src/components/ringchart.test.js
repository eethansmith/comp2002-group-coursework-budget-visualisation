import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

test('Hover feature', () => {
  const {container} = render(<RingChart data = {{Test: 32, Other: 45}} isDaily={false}/>);
  fireEvent.mouseOver(container.firstChild.childNodes[0]);
  const textElement = screen.getByText(/Test/i);
  expect(textElement).toBeInTheDocument();
});

test('Hover feature 2', () => {
  const {container} = render(<RingChart data = {{Test: 32, Other: 45}} isDaily={false}/>);
  fireEvent.mouseOver(container.firstChild.childNodes[1]);
  const textElement = screen.getByText(/Other/i);
  expect(textElement).toBeInTheDocument();
});