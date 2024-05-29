import React from 'react';

import './MainProfile.css'
import checkmarkGreen from '../../../static/images/checkmarkGreen.svg'
import warningExclamationMark from '../../../static/images/warningExclamationMark.svg'
import client from "../../../utils/api_request";
import getCsrf from "../../../utils/api_get_csrf";

function MainProfile({user}) {

    const confirmEmail = async () => {
        const sessionId = localStorage.getItem('sessionId');
        const csrfToken = await getCsrf(); // Ожидаем получение CSRF-токена
        client.post('api/v1/confirm-email/', {email: user.email}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionId}`,
                "X-CSRFToken": csrfToken,
            }
        })
        alert('Письмо отправлено!');
    };

    return (
        <>
            <div className='container'>
                <div className='main-profile'>
                    <p>Здравствуйте, <strong>{user.username}</strong></p>
                    {user.confirm_email && (
                        <div className='email-confirm'>
                            <p>Ваш email подтвержден</p>
                            <img src={checkmarkGreen} alt="checkmark green"/>
                            <p>({user.email})</p>
                        </div>
                    )}
                    {!user.confirm_email && (
                        <div className='email-confirm'>
                            <p>Ваш email не подтвержден</p>
                            <img src={warningExclamationMark} alt="warning exclamation mark"/>
                            <p>({user.email})</p>
                            <button onClick={confirmEmail}>Подтвердить email</button>
                        </div>
                    )}
                </div>
            </div>
            <div className='container'>
                <h3>Активные подписки</h3>
                <table className='subscription-table'>
                    <thead>
                    <tr>
                        <th className='equal-width'>Подписка</th>
                        <th className='equal-width'>Дата подписки</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Здесь вы можете использовать цикл или маппинг данных для создания строк таблицы */}
                    <tr>
                        <td>Подписка 1</td>
                        <td>Дата 1</td>
                    </tr>
                    <tr>
                        <td>Подписка 2</td>
                        <td>Дата 2</td>
                    </tr>
                    {/* Добавьте дополнительные строки по мере необходимости */}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default MainProfile;