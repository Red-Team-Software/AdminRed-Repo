import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import ReactDOM from "react-dom";

interface IDeleteModalProps {
    title: string;
    isOpen: boolean;
    onOpen: () => void;
    onConfirm: () => void;
}

export default function DeleteModal({ title, isOpen, onOpen, onConfirm }: IDeleteModalProps) {

    const container = document.getElementById('overlays') as HTMLElement;
    return ReactDOM.createPortal(

        <Modal isOpen={isOpen} size="sm" onClose={onOpen} >
            <ModalContent>
                <ModalHeader className="flex justify-center">{title}</ModalHeader>
                <ModalBody className="flex flex-col items-center">
                    <div className="flex justify-center">
                        <p className="text-lg text-slate-500">Seguro que quieres eliminarlo?</p>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-center py-4">

                    <Button size="lg" color="warning" onPress={onOpen}>
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        color="danger"
                        disabled={true}
                        className="text-white disabled:bg-slate-400"
                        onPress={onConfirm}
                    >
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >,
        container
    );
}

