import React from 'react';

function Test() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Frontend Test Page</h1>
            <p>If you can see this, React is working!</p>
            <p>Server is running on: {window.location.href}</p>
        </div>
    );
}

export default Test;
