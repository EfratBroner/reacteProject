import { createRoot } from 'react-dom/client';
import HelpRequestList from './HelpRequestList';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<HelpRequestList />);
  root.unmount();
});