
import { useState } from "react";
import './main.scss';
import Login from '../Login/Login';
import Register from "../Register/Register";
import HelpRequestList from "../HelpRequestList/HelpRequestList";
import Navbar from "../Navbar/Navbar";

export default function Main() {



    return (
        <div>
            <Navbar />
            <div>
                <HelpRequestList />
            </div>


        </div>

    )
}
