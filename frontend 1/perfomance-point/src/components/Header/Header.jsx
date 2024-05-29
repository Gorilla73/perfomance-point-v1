import React, {useState} from 'react';

import {Link, useNavigate} from "react-router-dom";

import client from "../../utils/api_request";
import deleteCookies from "../../utils/deleteCookies";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../../static/images/logo.png'
import "./Header.css"


function Header({currentUser, onCurrentUser}) {
    const navigate = useNavigate()
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const handleLogout = (e) => {
        e.preventDefault();
        client.post(
            "/api/v1/logout",
            {},
            {withCredentials: true}
        ).then(function(res) {
            localStorage.removeItem('sessionId');
            onCurrentUser(false);
            navigate('/')
        });
        navigate('/')
    }
    return (
        <div>
            <header>
                <div className='container-header'>
                    <div className="logo">
                        <a href="/" onClick={(e) => {
                            e.preventDefault();
                            navigate('/')
                        }}>
                            <img src={logo} alt="Logo"/>
                        </a>
                    </div>
                    {!currentUser ? (
                        <div className="authentication">
                        <div className="authorization">
                                <Link to="/login">Войти</Link>
                            </div>
                            <div className="registration">
                                <Link to="/registration">Зарегистрироваться</Link>
                            </div>
                        </div>
                    ) : (
                        <div className='profile'>
                            <div
                                className='profile-icon'
                                onMouseEnter={() => setShowProfileMenu(true)}
                                onMouseLeave={() => setShowProfileMenu(false)}
                            >
                                <FontAwesomeIcon icon={faUser} size='2x' />
                                {showProfileMenu && (
                                    <div className='profile-menu'>
                                        <Link to='/profile'>Профиль</Link>
                                        <Link to='/' onClick={handleLogout}>Выйти</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

        </div>
    );
}

export default Header;