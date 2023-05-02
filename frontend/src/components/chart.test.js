import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Chart from './chart';

test('Renders Ringchart', async () => {
    const { container} = render(<Chart data={{}} isRingChart={true} isDaily={true} />);
    expect(container.firstChild).toHaveClass('ringChart');
  });

  test('Renders Barchart', async () => {
    const { container} = render(<Chart data={{}} isRingChart={false} isDaily={true} />);
    expect(container.firstChild).toHaveClass('barChart');
  });