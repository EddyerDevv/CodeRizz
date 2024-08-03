"use client";
import { XIcon } from "lucide-react";
import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface ModalProps {
  state: {
    open: boolean;
    setOpen: any;
  };
  children: React.ReactNode;
  modalClose?: (onClose: () => void) => void;
  onClosed?: () => void;
  toPortal?: string | null;
}

const generateModalId = () => `modalId-${Math.random().toString(36).slice(2)}`;

export default function Modal({
  state,
  children,
  modalClose,
  toPortal = null,
  onClosed,
}: ModalProps) {
  const [modalId] = useState(generateModalId());
  const [modalState, setModalState] = useState(false);
  const modalRef = useRef<HTMLElement>(null);

  const onClose = useCallback(() => {
    const modalReference = modalRef.current;
    if (!(modalReference instanceof HTMLElement)) return;

    const closeModal = modalReference.querySelector(`#close-${modalId}`);
    if (!(closeModal instanceof HTMLElement)) return;

    setModalState(false);

    closeModal.addEventListener("transitionend", () => {
      state.setOpen(false);
      if (onClosed) onClosed();
    });
  }, [modalId, state.setOpen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (state.open) {
      timeoutId = setTimeout(() => {
        setModalState(true);
        setTimeout(() => {
          if (modalClose) modalClose(onClose);
        }, 10);
      }, 100);
    } else {
      setModalState(false);
    }

    return () => clearTimeout(timeoutId);
  }, [state.open]);

  return state.open
    ? createPortal(
        <main
          id={modalId}
          ref={modalRef}
          data-modalstate={modalState}
          className={`fixed flex flex-col items-center justify-center w-full h-full z-[500]`}
        >
          <div
            className="w-full h-full absolute z-[31] bg-black/50 backdrop-blur-md opacity-0 transition-[opacity] duration-[0.3s] ease-in-out data-[modalstate=true]:opacity-100 delay-[0.025s]"
            data-modalstate={modalState}
            id={`close-${modalId}`}
            onClick={onClose}
          ></div>
          <section
            data-modalstate={modalState}
            className="min-h-[9rem] bg-neutral-900 rounded-none border-[1px] border-neutral-600 z-[32] absolute pt-5 pb-2 px-4 opacity-0 scale-[0.6] transition-[opacity,transform,border-radius] duration-[0.25s] ease-in-out data-[modalState=true]:opacity-100 data-[modalstate=true]:scale-[1] md:rounded-xl"
            id={`content-${modalId}`}
          >
            <XIcon
              className="w-[1.1rem] h-[1.1rem] text-neutral-500 hover:text-neutral-200 absolute right-[0.625rem] top-[0.625rem] cursor-pointer transition-colors duration-[0.25s] ease-in-out"
              absoluteStrokeWidth
              onClick={onClose}
            />
            {children}
          </section>
        </main>,
        toPortal ? document.getElementById(toPortal)! : document.body
      )
    : null;
}
