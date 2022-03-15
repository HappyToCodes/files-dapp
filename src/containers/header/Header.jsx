import React from 'react';
import './header.scss'
import { CgProfile } from 'react-icons/cg'
import { useSelector } from 'react-redux';

function Header() {
    const _auth = JSON.parse(localStorage.getItem('authData') || '{}');
    const userId = _auth?.userAddress || '-';
    return (
        <div className="header">
            <div className="header__logoBox">
                <img src="/logo.png" alt="" />
                <p className='gradient__text'>Lighthouse</p>
            </div>
            <div className="header__infoBox">
                <CgProfile />&nbsp;
                <span>|</span>&nbsp;
                <span className='userName'>{userId}</span>
            </div>
        </div>
    )
}

export default Header;
