import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import client from "../../../utils/api_request";

function ConfirmEmailPage({onCurrentUser}) {
    const { key } = useParams();
    const navigate = useNavigate()

    const confirmEmail = async () => {
        try {
            const response = await client.post(`api/v1/confirm-email/${key}/`);
            alert('Email успешно подтвержден! Авторизуйтесь')
            client.post(
                "/api/v1/logout",
                {},
                {withCredentials: true}
            ).then(function(res) {
                localStorage.removeItem('sessionId');
                onCurrentUser(false);
                navigate('/')
            });
            navigate('/login')
        } catch (error) {
        }
    };

    useEffect(() => {
        confirmEmail();
    }, [key]);

    return (
        <>
        </>
    );
}

export default ConfirmEmailPage;