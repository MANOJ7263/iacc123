import React from 'react';

const LiveStatusBadge = ({ status }) => {
    // Status: 'running' | 'success' | 'failed' | 'idle'

    let className = 'status-badge';
    let label = status;

    if (status === 'running') {
        className += ' status-running';
        label = 'Running';
    } else if (status === 'success') {
        className += ' status-success';
        label = 'Success';
    } else {
        // Default gray
        className += ' bg-slate-100 text-slate-800';
    }

    return (
        <span className={className}>
            {status === 'running' && <span style={{ marginRight: '6px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>}
            {label}
        </span>
    );
};

export default LiveStatusBadge;
