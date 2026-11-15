"use client";

import Modal from "react-bootstrap/Modal";

export default function ModalForm({ show, onHide, children, size = "lg" }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      dialogClassName="modal-encomenda"
    >
      <Modal.Body className="p-0">
        {children}
      </Modal.Body>
    </Modal>
  );
}