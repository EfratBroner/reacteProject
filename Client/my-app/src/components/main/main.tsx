
import { useState } from "react";
import './main.scss';
import HelpRequestList from "../HelpRequestList/HelpRequestList";
import Navbar from "../Navbar/Navbar";

export default function Main() {
    return (
        <div>
            <Navbar />
            <div className="main-content"> 
                <HelpRequestList />
            </div>
        </div>
    )
}