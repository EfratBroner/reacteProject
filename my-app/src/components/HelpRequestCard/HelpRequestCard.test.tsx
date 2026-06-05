import { createRoot } from 'react-dom/client';
import HelpRequestCard from './HelpRequestCard';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<HelpRequestCard />);
  root.unmount();
});