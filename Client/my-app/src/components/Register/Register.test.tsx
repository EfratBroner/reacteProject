import { createRoot } from 'react-dom/client';
import Register from './Register';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<Register />);
  root.unmount();
});