import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import client from '../../utils/api_request'

import './RegistrationPage.css'

function RegistrationPage({onCurrentUser}) {
    const [isCaptchaSuccessful, setIsCaptchaSuccess] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isOver18: false,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают!');
            return; // Останавливаем отправку формы
        }

        client.post(
            "/api/v1/register",
            {
                email: formData.email,
                username: formData.username,
                password: formData.password
            }
        ).then(function (registerRes) {
            client.post(
                "/api/v1/login",
                {
                    email: formData.email,
                    password: formData.password
                },
                { withCredentials: true }
            ).then(function (loginRes) {
                // Сохраняем информацию в localStorage
                console.log(loginRes)
                localStorage.setItem('sessionId', JSON.stringify(loginRes.data.session_id));

                onCurrentUser(true);
                alert('Поздравляем! Вы успешно зарегистрировались');
                navigate('/')
            }).catch(function (error) {
                if (error.response && error.response.data) {
                    alert('Ошибка при входе: ' + error.response.data.error);
                } else {
                    alert('Ошибка при входе');
                }
            });
        }).catch(function (error) {
            console.log(error)
            if (error.response && error.response.data) {
                alert('Ошибка при регистрации: ' + error.response.data.error);
            } else {
                alert('Ошибка при регистрации');
            }
        });
    }

    return (
        <div className="registration-container">
            <h3>Регистрация</h3>
            <p>Пройдите регистрацию, чтобы получить полный доступ ко всему функционалу сайта</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username" className="required">Никнейм: </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Никнейм"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="required">Email: </label>
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
                    <label htmlFor="password" className='required'>Пароль: (мин. 8 символов)</label>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword" className='required'>Подтвердите пароль: </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Подтвердите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            style={{marginRight: '0.5em'}}
                            type="checkbox"
                            name="isOver18"
                            checked={formData.isOver18}
                            onChange={handleChange}
                            required
                        />
                        Я подтверждаю, что мне исполнилось 18 лет <span style={{color: 'red'}}>*</span>
                    </label>
                    <div className='captcha'>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            onChange={onChangeCaptcha}
                        />
                    </div>
                </div>
                <div className='registration-btn'>
                    <button disabled={!isCaptchaSuccessful} type="submit">Зарегистрироваться</button>
                </div>
            </form>
        </div>
    );
}

export default RegistrationPage;
