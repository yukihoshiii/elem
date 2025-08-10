import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [modalData, setModalData] = useState({ inputValue: '' });

  const openModal = (data) => {
    setModalData({ ...data, inputValue: '' });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setModalData({ inputValue: '' });
  };

  const handleInputChange = (value) => {
    setModalData((prev) => ({ ...prev, inputValue: value }));
  };

  return (
    <ModalContext.Provider value={{ isOpen, modalData, openModal, closeModal, handleInputChange }}>
      {children}
    </ModalContext.Provider>
  );
}