import React, {useState} from 'react';

import './AccountProfile.css'
import ReCAPTCHA from "react-google-recaptcha";
import {useNavigate} from "react-router-dom";
import client from "../../../utils/api_request";
import getCsrf from "../../../utils/api_get_csrf";

function AccountProfile({user, onUser, onCurrentUser}) {
    const navigate = useNavigate()
    const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false)
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    function onChangeCaptcha(value) {
        setIsCaptchaSuccess(true)
        console.log("captcha value: ", value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            alert('Пароли не совпадают!');
            return; // Останавливаем отправку формы
        }

        if (formData.newPassword.length < 8 || formData.confirmNewPassword.length < 8) {
            alert('Минимальная длина пароля 8 символов!');
            return; // Останавливаем отправку формы
        }
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                const csrfToken = await getCsrf(); // Ожидаем получение CSRF-токена
                client.put('/api/v1/user', {changePassword: formData}, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionId}`,
                        "X-CSRFToken": csrfToken,
                    }
                })
                    .then((res) => {
                        alert('Пароль успешно изменен! Авторизуйтесь заново!')
                        client.post(
                            "/api/v1/logout",
                            {},
                            {withCredentials: true}
                        ).then(function(res) {
                            localStorage.removeItem('sessionId');
                            onCurrentUser(false)
                            navigate('/')
                        });
                    })
                    .catch((error) => {
                        // Обработка ошибки
                        console.error('Ошибка при обновлении данных:', error);
                    });
            } catch (error) {
                console.error('Ошибка при получении CSRF-токена:', error);
            }
        }
    };
    return (
        <div className='account-profile'>
            <div className="change-password-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword" className="required">Текущий пароль: </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            placeholder="Текущий пароль"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword" className='required'>Новый пароль: (мин. 8 символов)</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            placeholder="Введите новый пароль"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className='required'>Подтвердите новый пароль: </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            placeholder="Подтвердите новый пароль"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <div className='captcha'>
                            <ReCAPTCHA
                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                onChange={onChangeCaptcha}
                            />
                        </div>
                    </div>
                    <div className='change-password-btn'>
                        <button disabled={!isCaptchaSuccessful} type="submit">Изменить пароль</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AccountProfile;