import { useEffect, useState } from "react";
import './main.scss';
import HelpRequestList from "../HelpRequestList/HelpRequestList";
import Navbar from "../Navbar/Navbar";
import type { HelpRequest } from "../../models/helpRequest.model";
import api from '../../api';
import { useNavigate, Outlet, useLocation } from 'react-router-dom'; // 🌟 ייבוא הכלים של הראוטר

export default function Main() {
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const navigate = useNavigate();
    const location = useLocation(); // 🌟 עוזר לנו לדעת באיזה דף המשתמש נמצא כרגע

    const loadRequests = async () => {
        const response = await api.get('/helpRequest');
        setRequests(response.data as HelpRequest[]);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    return (
        <div>
            {/* הנייבר תמיד קיים למעלה ומקבל את פונקציית הרענון שלו */}
            <Navbar onRefreshRequests={loadRequests} />
            
            <div className="main-content">
                {/* 🌟 אם המשתמש נמצא בדיוק בנתיב הראשי "/" או ב-"/login"/"/register" - נציג את הרשימה */}
                {location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' ? (
                    <HelpRequestList 
                        requests={requests} 
                        onSelect={(r) => navigate(`/details/${r._id}`, { state: { request: r } })} 
                    />
                ) : (
                    <Outlet context={{ requests, loadRequests }} />
                )}
            </div>
        </div>
    )
}