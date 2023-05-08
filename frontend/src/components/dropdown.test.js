import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DropDown from './DropDown';

describe('DropDown component', () => {
  const mockProps = {
    isDaily: true,
    setTimestamp: jest.fn(),
  };

  test('renders the DropDown component with days', () => {
    render(<DropDown {...mockProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    const daysInMonth = new Date().getDate();
    expect(screen.getAllByRole('option')).toHaveLength(daysInMonth);
  });

  test('renders the DropDown component with months', () => {
    render(<DropDown {...mockProps} isDaily={false} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(12);
  });

  test('onChange event calls setTimestamp function', () => {
    render(<DropDown {...mockProps} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1682895600000' } });
    expect(mockProps.setTimestamp).toHaveBeenCalledWith('1682895600000');
  });

  test('calls setTimestamp with the value of the currently selected option after initial rendering', () => {
    render(<DropDown {...mockProps} />);
    const dropdown = screen.getByRole('combobox');
    const selectedValue = dropdown.value;
    expect(mockProps.setTimestamp).toHaveBeenCalledWith(selectedValue);
  });
});



