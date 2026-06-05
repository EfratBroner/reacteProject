import { createRoot } from 'react-dom/client';
import MyRequests from './MyRequests';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<MyRequests />);
  root.unmount();
});