import Modal from "./modal";
import {Button} from "./ui/button";
import React from "react";

interface SaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const SaveModal = ({
    isOpen, 
    onClose, 
    onConfirm, 
    loading
}: SaveModalProps) => {
    return (
        <Modal 
        title="Save Answer"
        description="Are you sure you want to save this answer? You won't be able to change it later."
        isOpen={isOpen}
        onClose={onClose}
        >
            <div className="mt-4 flex justify-end space-x-2">
                <Button disabled={loading} variant="outline" onClick={onClose}>Cancel</Button>
                <Button disabled={loading} onClick={onConfirm}>Continue</Button>
            </div>
        </Modal>
    );
};
                    