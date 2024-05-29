import React from 'react';

import './Footer.css'
import iconTelegramm from '../../static/images/icon-telegram.svg'
import iconVk from '../../static/images/icon-vk.svg'

function Footer(props) {
    return (
        <footer className="footer">
            <p>Все права защищены 2024 © Performance-point.ru</p>
            {/* Добавьте здесь другой контент вашего футера, если необходимо */}
            <div className='links'>
                <a href="#"><img src={iconTelegramm} alt="Телеграм"/></a>
                <a href="#"><img src={iconVk} alt="ВКонтакте"/></a>
            </div>
            <div>
                <p>Адрес электронной почты: support@performance-point.ru</p>
                <p>Телефон поддержки: +7 777 777 77 77</p>
                <p>Возрастные ограничения информационной продукции, предусмотренные ФЗ от 29.12.2010 N436-ФЗ «О защите
                    детей от информации, причиняющей вред их здоровью и развитию»: 18+</p>
            </div>

        </footer>
    );
}

export default Footer;