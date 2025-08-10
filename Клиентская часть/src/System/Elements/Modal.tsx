import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { I_CLOSE } from '../UI/IconPack';
import { useModal } from '../Context/Modal';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { TextInput } from '../../UIKit';

interface ModalData {
  title: string;
  text: string;
  type: 'input' | 'query' | 'alert';
  onNext?: (value: string) => void;
}

interface ModalContext {
  isOpen: boolean;
  closeModal: () => void;
  modalData: ModalData;
}

export const Modal: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, closeModal, modalData } = useModal() as ModalContext;
  const [localInputValue, setLocalInputValue] = useState<string>('');

  const animations: Variants = {
    hidden: {
      transform: 'translate(-50%, -50%) scale(1.5)',
      opacity: 0,
      visibility: 'visible',
    },
    show: {
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 1,
      boxShadow: 'var(--AIR_SHADOW)',
      transition: { duration: 0.2 },
    },
    hide: {
      transform: 'translate(-50%, -50%) scale(1.5)',
      opacity: 0,
      transition: { duration: 0.2 },
    }
  };

  const handleNext = (): void => {
    if (modalData.onNext) {
      modalData.onNext(localInputValue);
    }
    closeModal();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="UI-Window_BG"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="UI-Window"
            initial="hidden"
            animate="show"
            exit="hide"
            variants={animations}
          >
            <div className="UI-Window_content">
              <div className="UI-Window_title">{modalData.title}</div>
              <div className="UI-Window_text">{modalData.text}</div>
            </div>
            {modalData.type === 'input' && (
              <TextInput
                value={localInputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLocalInputValue(e.target.value)
                }
                type="text"
                placeholder={t('input_text')}
              />
            )}
            <div className="UI-Window_BTNS">
              {(modalData.type === 'query' || modalData.type === 'input') ? (
                <>
                  <button onClick={handleNext} className="UI-Window_button">
                    Далее
                  </button>
                  <button onClick={closeModal} className="UI-Window_BTN_NOACT UI-Window_button">
                    Отменить
                  </button>
                </>
              ) : (
                <button onClick={closeModal} className="UI-Window_button">
                  Хорошо
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface QueryWindowProps {
  data: {
    title: string;
    text: string;
  };
  value: string;
  setValue: (value: string) => void;
  onNext: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const QueryWindow: React.FC<QueryWindowProps> = ({ data, value, setValue, onNext, isOpen, setOpen }) => {
  const { t } = useTranslation();

  const animations: Variants = {
    hidden: {
      transform: 'translate(-50%, -50%) scale(1.5)',
      opacity: 0,
      visibility: 'visible',
    },
    show: {
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 1,
      boxShadow: 'var(--AIR_SHADOW)',
      transition: { duration: 0.2 },
    },
    hide: {
      transform: 'translate(-50%, -50%) scale(1.5)',
      opacity: 0,
      transition: { duration: 0.2 },
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="UI-Window_BG"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="UI-Window"
            initial="hidden"
            animate="show"
            exit="hide"
            variants={animations}
          >
            <div className="UI-Window_content">
              <div className="UI-Window_title">{data.title}</div>
              <div className="UI-Window_text">{data.text}</div>
            </div>
            <input
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              type="text"
              placeholder={t('input_text')}
            />
            <div className="UI-Window_BTNS">
              <button onClick={onNext} className="UI-Window_button">
                Далее
              </button>
              <button onClick={() => setOpen(false)} className="UI-Window_BTN_NOACT UI-Window_button">
                Отменить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface UniversalPanelProps {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
}

export const UniversalPanel: React.FC<UniversalPanelProps> = ({ className = '', children, isOpen }) => {
  const variants: Variants = {
    open: {
      opacity: 1,
      visibility: 'visible'
    },
    closed: {
      opacity: 0,
      visibility: 'hidden'
    },
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`UI-UniversalPanel ${className}`}
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface WindowProps {
  title: string;
  content: React.ReactNode;
  className?: string;
  contentClass?: string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const Window: React.FC<WindowProps> = ({ title, content, className = '', contentClass = '', style, contentStyle, isOpen, setOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="UI-Blur"
            initial={{ opacity: 0, visibility: 'visible' }}
            animate={{ opacity: 1, visibility: 'visible' }}
            exit={{ opacity: 0, visibility: 'hidden' }}
          />
          <motion.div
            className={classNames('UI-ActionWindow', className)}
            style={style}
            initial={{ opacity: 0, visibility: 'visible' }}
            animate={{ opacity: 1, visibility: 'visible' }}
            exit={{ opacity: 0, visibility: 'hidden' }}
          >
            <div className="TopBar">
              <div className="Title">{title}</div>
              <button onClick={() => setOpen(false)}>
                <I_CLOSE />
              </button>
            </div>
            <div className={classNames('UI-AW_Content', contentClass)} style={contentStyle}>
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
