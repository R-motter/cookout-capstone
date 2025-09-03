import React from 'react';
import './Modal.css'

const Modal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          {/*<h3>Menu</h3>*/}
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="menu-item">
          {children}
          </div>
        </div>
      </div>
    </div>
    )
};

let modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  let modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    position: 'relative',
    paddingTop: '40px',
    paddingBottom: '40px',
    display: 'flex',
    flexDirection: 'column'
  };
  
  let closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'transparent',
    fontSize: '1.5rem',
    cursor: 'pointer',
  };
  

export default Modal;