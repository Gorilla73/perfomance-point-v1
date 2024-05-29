import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import axios from "axios";

import client from "../../utils/api_request";

import './AuthorizationPage.css'

axios.defaults.withCredentials = true;

function AuthorizationPage({onCurrentUser}) {
    const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(true)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    function onChangeCaptcha(value) {
        setIsCaptchaSuccess(true)
        console.log("captcha value: ", value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        client.post(
            "/api/v1/login",
            {
                email: formData.email,
                password: formData.password
            },
            { withCredentials: true }
        ).then((res) => {
            localStorage.setItem('sessionId', JSON.stringify(res.data.session_id));

            alert('Поздравляем! Вы успешно вошли.');
            onCurrentUser(true);
            navigate('/');
        }).catch((error) => {
            console.log(error)
            if (error.response && error.response.data) {
                alert('Ошибка при входе: ' + error.response.data.error);
            } else {
                alert('Ошибка при входе');
            }
        });
    };

    return (
            <div className="authorization-container">
                <h3>Авторизация</h3>
                <p>Войдите, чтобы получить доступ к полному функционалу сайта</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Введите пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='captcha'>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            onChange={onChangeCaptcha}
                        />
                    </div>
                    <div className='auth-btn'>
                        <button disabled={!isCaptchaSuccessful} type="submit">Войти</button>
                    </div>
                </form>
            </div>
    );
}

export default AuthorizationPage;
