"use client";

import { Modal, Button } from "react-bootstrap";

type ConfirmModalProps = {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    message: string;
};

const ConfirmModal = ({ show, onHide, onConfirm, message }: ConfirmModalProps) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;