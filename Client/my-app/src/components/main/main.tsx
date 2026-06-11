
import { useEffect, useState } from "react";
import './main.scss';
import HelpRequestList from "../HelpRequestList/HelpRequestList";
import Navbar from "../Navbar/Navbar";
import AddHelpRequest from "../AddHelpRequest/AddHelpRequest";
import type { HelpRequest } from "../../models/helpRequest.model";
import api from '../../api';

export default function Main() {

    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const loadRequests = async () => {
        const response = await api.get('/helpRequest');
        setRequests(response.data as HelpRequest[]);
    };

    useEffect(() => {
        loadRequests();
    }, []);
    return (
        <div>
            <Navbar />
            <div className="main-content">

                <AddHelpRequest onSuccess={loadRequests} />

                <HelpRequestList requests={requests} />
            </div>
        </div>
    )
}