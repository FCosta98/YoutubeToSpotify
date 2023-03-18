import axios from "axios"
import React, { useEffect, useState } from 'react';
import '../css/Callback.css'

export default function Callback2() {
    useEffect(() => {
        const handleCallback = async () => {
            const code  = new URLSearchParams(window.location.search).get('code');
            console.log(code)
            axios.post("http://localhost:3001/login", {
                code,
            })
            .then(res => {
                console.log("j ai les tokens")
                console.log("ACCES",res.data.accessToken)
                console.log("REFRESH",res.data.refreshToken)
                console.log("EXPIRE",res.data.expiresIn)
                localStorage.setItem('accessToken2', res.data.accessToken);
                localStorage.setItem('refreshToken2', res.data.refreshToken);
                localStorage.setItem('expireIn2', res.data.expiresIn);
                window.location.href = '/';
            })
            .catch(() => {
                window.location.href = '/';
            })
        };
        handleCallback();
    }, []);

    return (
        <div>
            <h1 className="callback-container">Redirecting...</h1>
        </div>
    );
}