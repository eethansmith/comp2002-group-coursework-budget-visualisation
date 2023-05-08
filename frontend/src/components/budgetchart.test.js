import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BudgetChart from './budgetchart';

// Utility function to render the component with given props
const renderComponent = (props) => {
  return render(<BudgetChart {...props} />);
};

const data = {
    Bills: 50,
    Groceries: 25,
    Other: 25,
  };

describe('BudgetChart', () => {
  it('renders correctly with given data', () => {

    renderComponent({ data });

    expect(screen.getByText('Monthly Income:')).toBeInTheDocument();
    expect(screen.getByText('Bills:')).toBeInTheDocument();
    expect(screen.getByText('Groceries:')).toBeInTheDocument();
    expect(screen.getByText('Other:')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('updates salary input correctly', () => {
    renderComponent({data});

    const salaryInput = screen.getByTestId('salary-input');
    userEvent.clear(salaryInput);
    userEvent.type(salaryInput, '3000');

    expect(salaryInput).toHaveValue('3000');
  });

  it('updates percentage input correctly and limits to 100', () => {
    renderComponent({data});

    const groceriesInput = screen.getAllByRole('textbox', { name: '' })[1];
    const billsInput = screen.getAllByRole('textbox', { name: '' })[2];
    const otherInput = screen.getAllByRole('textbox', { name: '' })[3];
    userEvent.clear(billsInput);
    userEvent.clear(groceriesInput);
    userEvent.clear(otherInput);
    userEvent.type(billsInput, '110');

    expect(billsInput).toHaveValue('100');
  });

  it('displays a warning when the sum of percentages is less than 100', () => {
    const data = {
      Bills : 500,
      Groceries: 300,
      Other: 200,
    };
    renderComponent({ data });

    const billsInput = screen.getAllByRole('textbox', { name: '' })[1];
    userEvent.clear(billsInput);
    userEvent.type(billsInput, '30');

    const warning = screen.getByText(/Warning:.*% of salary not budgeted/);
    expect(warning).toBeInTheDocument();
  });

  it('should display over-budget text', () => {
    const data = {
      Bills: 500,
      Groceries: 300,
      Other: 400,
    };
    renderComponent({ data });

    const overBudgetText = screen.getByText('Over-Budget');
    expect(overBudgetText).toBeInTheDocument();
  });
  
});




