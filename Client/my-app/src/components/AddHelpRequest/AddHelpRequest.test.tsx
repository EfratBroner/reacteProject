import { createRoot } from 'react-dom/client';
import AddHelpRequest from './AddHelpRequest';

it('should mount', () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<AddHelpRequest />);
  root.unmount();
});