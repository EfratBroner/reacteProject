import { createRoot } from 'react-dom/client';
import Navbar from './Navbar';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<Navbar />);
  root.unmount();
});