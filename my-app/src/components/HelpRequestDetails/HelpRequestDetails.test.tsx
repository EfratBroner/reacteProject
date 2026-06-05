import { createRoot } from 'react-dom/client';
import HelpRequestDetails from './HelpRequestDetails';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<HelpRequestDetails />);
  root.unmount();
});