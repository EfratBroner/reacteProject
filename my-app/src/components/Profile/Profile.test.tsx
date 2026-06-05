import { createRoot } from 'react-dom/client';
import Profile from './Profile';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<Profile />);
  root.unmount();
});