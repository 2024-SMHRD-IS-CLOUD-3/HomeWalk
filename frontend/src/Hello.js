import React, { useState, useEffect } from 'react';

function Hello() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/hello')
            .then(response => response.text())
            .then(data => setMessage(data));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}

export default Hello;

