import React, { useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ToastComponent({content,delay,trigger}) {
  const [position, setPosition] = useState('top-end');
  const [show, setShow] = useState(true);
  const [content_data, setContent] = useState('');
  const [delay_data, setDelay] = useState(5000);

  useEffect(() => {
    setContent(content);
  }, [content]);

  useEffect(() => {
    setDelay(delay);
  }, [delay]);

  useEffect(() => {
    setShow(trigger);
  }, [trigger]);

  return (
    <>
        <ToastContainer
          className="p-3"
          position={position}
          style={{ zIndex: 1 }}
        >
          <Toast bg='danger' onClose={() => setShow(false)} show={show} delay={delay_data} autohide>
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Error</strong>
              <small></small>
            </Toast.Header>
            <Toast.Body>{content_data}</Toast.Body>
          </Toast>
        </ToastContainer>
    </>
  );
}

export { ToastComponent };