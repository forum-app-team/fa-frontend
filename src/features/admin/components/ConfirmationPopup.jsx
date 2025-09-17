import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ConfirmationPopup({ show, onHide, title, bodyContent, handlerRef }) {
  const handleClick = async () => {
    try {
        await handlerRef.current();
        onHide();
    } catch (err) {
        console.error(err);
    }
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title ?? ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body> {bodyContent}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleClick}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}