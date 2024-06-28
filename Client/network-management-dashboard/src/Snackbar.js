import React from 'react';
import './Snackbar.css';

const Snackbar = ({ message, type, onClose }) => {
    return (
        <div className={`snackbar ${type}`}>
            {message}
            <button onClick={onClose} className="snackbar-close">&times;</button>
        </div>
    );
};

export default Snackbar;
