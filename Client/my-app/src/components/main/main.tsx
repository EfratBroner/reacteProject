import { useEffect, useState } from "react";
import './main.scss';
import HelpRequestList from "../HelpRequestList/HelpRequestList";
import Navbar from "../Navbar/Navbar";
import type { HelpRequest } from "../../models/helpRequest.model";
import api from '../../api';
import { useNavigate } from 'react-router-dom';

export default function Main() {
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const navigate = useNavigate();

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
                <HelpRequestList requests={requests} onSelect={(r) => navigate(`/details/${r._id}`, { state: { request: r } })} />
            </div>
        </div>
    )
}