import { render, screen } from '@testing-library/react';

const ExampleComponent = () => <div>Hello, Jest!</div>;

test('renders example component', () => {
  render(<ExampleComponent />);
  expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
});
