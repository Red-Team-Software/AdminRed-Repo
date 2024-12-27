import { ModalTarget } from "@/types"
import { useState } from "react";

const useShowList = <T extends { id: string }>(list: T[]) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTargetState, setModalTargetState] = useState<ModalTarget>(ModalTarget.VIEW);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const handleOpenModal = (target: ModalTarget, id?: string) => {
        setModalTargetState(target);
        if (id) {
            setSelectedItem(list.find((item) => item.id === id) || null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    return {
        isModalOpen,
        selectedItem,
        modalTargetState,
        setSelectedItem,
        handleOpenModal,
        handleCloseModal,
    };
};

export default useShowList;