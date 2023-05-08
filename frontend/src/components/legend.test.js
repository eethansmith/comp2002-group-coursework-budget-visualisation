import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Legend from './legend';

describe('Legend component', () => {
  const mockData = {
    ItemA: 10,
    ItemB: 20,
    ItemC: 30,
  };

  test('renders the Legend component with legend items and labels', () => {
    render(<Legend data={mockData} />);
    expect(screen.getByText(/Legend/i)).toBeInTheDocument();
    expect(screen.getByText(/ItemA/i)).toBeInTheDocument();
    expect(screen.getByText(/ItemB/i)).toBeInTheDocument();
    expect(screen.getByText(/ItemC/i)).toBeInTheDocument();
  });

  test('renders the correct number of legend items', () => {
    const { container } = render(<Legend data={mockData} />);
    const legendItems = container.querySelectorAll('g');
    expect(legendItems.length).toBe(Object.keys(mockData).length);
  });
});