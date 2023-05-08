import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import RingChart from './ringchart';

test('Renders Daily view ringchart', async () => {
  const {container} = render(<RingChart data={{}} isDaily={true} timestamp={1667260800000}  />);
  const textElement = screen.getByText(/1 Nov/i);
  expect(textElement).toBeInTheDocument();
});

test('Renders Monthly view ringchart', async () => {
  const {container} = render(<RingChart data={{}} isDaily={false} timestamp={1667260800000}/>);
  const textElement = screen.getByText(/Nov 2022/i);
  expect(textElement).toBeInTheDocument();
});
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

const renderRingChart = (props) => {
  return render(<RingChart {...props} />);
};

const mockData = {
  Bills: 100,
  Groceries: 50,
  Other: 50,
};

const mockProps = {
  data: mockData,
  setModalIsOpen: jest.fn(),
  setDataKey: jest.fn(),
  setColor: jest.fn(),
  timestamp: Date.now(),
  isDaily: false,
};

describe('RingChart', () => {
  it('renders without crashing', () => {
    renderRingChart(mockProps);
  });

  it('displays correct total spent', () => {
    const { getByText } = renderRingChart(mockProps);
    expect(getByText('£200.00')).toBeInTheDocument();
  });

  it('renders the correct number of segments', () => {
    const { container } = renderRingChart(mockProps);
    const segments = container.querySelectorAll('.Section');
    expect(segments.length).toEqual(Object.keys(mockData).length);
  });

  it('displays the correct date format based on isDaily prop', () => {
    const { getByText, rerender } = renderRingChart(mockProps);
    const dailyFormat = /\d{1,2}\s\w{3}/;
    const monthlyFormat = /\w{3}\s\d{4}/;
  
    expect(getByText(monthlyFormat)).toBeInTheDocument(); 
    rerender(<RingChart {...mockProps} isDaily />);
    expect(getByText(dailyFormat)).toBeInTheDocument(); 
  });

  it('updates text and value when hovering over a segment', () => {
    const { getByText, container } = renderRingChart(mockProps);
    const segment = container.querySelector('.Section');

    fireEvent.mouseOver(segment);
    expect(getByText('Bills')).toBeInTheDocument();
    expect(getByText('£100.00')).toBeInTheDocument();

    fireEvent.mouseLeave(segment);
    expect(getByText('Spent')).toBeInTheDocument();
    expect(getByText('£200.00')).toBeInTheDocument();
  });

  it('calls setModalIsOpen, setDataKey, and setColor when clicking on a segment', () => {
    const { container } = renderRingChart(mockProps);
    const segment = container.querySelector('.Section');

    fireEvent.mouseDown(segment);
    expect(mockProps.setModalIsOpen).toHaveBeenCalled();
    expect(mockProps.setDataKey).toHaveBeenCalledWith('Bills');
    expect(mockProps.setColor).toHaveBeenCalled();
  });
});
