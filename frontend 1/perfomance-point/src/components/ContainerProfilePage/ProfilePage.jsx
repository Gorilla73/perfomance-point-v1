import React, {useEffect, useState} from 'react';

import NavProfile from "./NavProfile/NavProfile";

import './ProfilePage.css'
import client from "../../utils/api_request";
import axios from "axios";

function ProfilePage({onCurrentUser}) {

    const [user, setUser] = useState({})

    const handleUser = (user) => {
        setUser(user)
    }

    const handleSubmitUser = () => {
        // const sessionIdCookie = document.cookie.split('; ').find(row => row.startsWith('sessionId'));
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            // const sessionId = sessionIdCookie.split('=')[1];
            client.get("/api/v1/user", {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionId}`
                }
            }).then((res) => {
                setUser(res.data.user);
            }).catch((error) => {
                if (error.response && error.response.data) {
                    alert('Ошибка при получении данных: ' + error.response.data.error);
                } else {
                    alert('Ошибка при получении данных');
                }
            });
        } else {
            console.log('sessionId отсутствует в куки');
            // Дополнительные действия, если sessionId отсутствует
        }
    };


    useEffect(() => {
        handleSubmitUser()
    }, []);

    return (
        <div>
            <div>
                <NavProfile user={user} onUser={handleUser} onCurrentUser={onCurrentUser}/>
            </div>
        </div>
    );
}

export default ProfilePage;