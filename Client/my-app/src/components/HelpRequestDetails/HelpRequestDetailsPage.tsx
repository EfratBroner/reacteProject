import { useLocation, useNavigate } from 'react-router-dom';
import HelpRequestDetails from './HelpRequestDetails';
import type { HelpRequest } from '../../models/helpRequest.model';

export default function HelpRequestDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const request: HelpRequest | null = state?.request ?? null;

  if (!request) return <div>בקשה לא נמצאה</div>;

  return <HelpRequestDetails request={request} onBack={() => navigate('/')} />;
}
