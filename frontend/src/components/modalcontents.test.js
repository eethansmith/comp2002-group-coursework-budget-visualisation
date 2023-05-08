import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ModalContents from './modalcontents';

describe('ModalContents component', () => {
  const mockCategoryData = {
    0: {
      date: '2023-05-08T12:30:00',
      merchant: 'MerchantA',
      amount: 10,
    },
    1: {
      date: '2023-05-09T15:45:00',
      merchant: 'MerchantB',
      amount: 20,
    },
  };

  const mockProps = {
    categoryData: mockCategoryData,
    dataKey: 'TestKey',
    color: '#7D2B54',
    spent: 30,
    percentage: 60,
    setModalIsOpen: jest.fn(),
  };

  test('renders the ModalContents component with dataKey, stats, and rows', () => {
    render(<ModalContents {...mockProps} />);
    expect(screen.getByText(/TestKey/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent: £30.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Percentage: 60%/i)).toBeInTheDocument();
    expect(screen.getByText(/MerchantA/i)).toBeInTheDocument();
    expect(screen.getByText(/MerchantB/i)).toBeInTheDocument();
  });

  test('renders the correct number of rows based on the categoryData prop', () => {
    const { container } = render(<ModalContents {...mockProps} />);
    const rows = container.querySelectorAll('.Row');
    expect(rows.length).toBe(Object.keys(mockCategoryData).length);
  });
});