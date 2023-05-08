import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';

describe('Header component', () => {
  const mockProps = {
    updateDaily: jest.fn(),
    setCurrentPage: jest.fn(),
    currentPage: 1,
  };

  test('renders the Header component with buttons', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText(/Daily View/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly View/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget View/i)).toBeInTheDocument();
  });

  test('button click calls updateDaily and setCurrentPage functions', () => {
    render(<Header {...mockProps} />);
    fireEvent.click(screen.getByText(/Daily View/i));
    expect(mockProps.updateDaily).toHaveBeenCalledWith(true);
    expect(mockProps.setCurrentPage).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText(/Monthly View/i));
    expect(mockProps.updateDaily).toHaveBeenCalledWith(false);
    expect(mockProps.setCurrentPage).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText(/Budget View/i));
    expect(mockProps.updateDaily).toHaveBeenCalledWith(false);
    expect(mockProps.setCurrentPage).toHaveBeenCalledWith(3);
  });

  test('selected button is based on currentPage prop', () => {
    const { rerender } = render(<Header {...mockProps} />);
    expect(screen.getByText(/Daily View/i)).toHaveClass('selected');

    rerender(<Header {...mockProps} currentPage={2} />);
    expect(screen.getByText(/Monthly View/i)).toHaveClass('selected');

    rerender(<Header {...mockProps} currentPage={3} />);
    expect(screen.getByText(/Budget View/i)).toHaveClass('selected');
  });
});
