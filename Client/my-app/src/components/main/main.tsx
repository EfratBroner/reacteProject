import { useEffect, useState } from "react";
import './main.scss';
import HelpRequestList from "../HelpRequestList/HelpRequestList";
import HelpRequestDetails from "../HelpRequestDetails/HelpRequestDetails";
import Navbar from "../Navbar/Navbar";
import type { HelpRequest } from "../../models/helpRequest.model";
import api from '../../api';

export default function Main() {
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);

    const loadRequests = async () => {
        const response = await api.get('/helpRequest');
        setRequests(response.data as HelpRequest[]);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    return (
        <div>
           <Navbar onRefreshRequests={loadRequests} />
            <div className="main-content">
                {selectedRequest
                    ? <HelpRequestDetails request={selectedRequest} onBack={() => setSelectedRequest(null)} />
                    : <HelpRequestList requests={requests} onSelect={setSelectedRequest} />
                }
            </div>
        </div>
    )
}