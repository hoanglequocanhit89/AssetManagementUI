import { ReactNode } from "react";
import "./style.scss";

interface formModalProps {
  title: string;
  closeBtn?: boolean;
  children: ReactNode;
  overlay?: boolean;
  closeModal?: () => void;
}

const FormModal = (props: formModalProps) => {
  const { title, closeBtn, children, overlay = true, closeModal } = props;

  const handleCloseClick = () => {
    if (!closeBtn) return;
    closeModal && closeModal();
  };

  return (
    <>
      {overlay && <div className="form-modal__overlay"></div>}
      <div className="form-modal">
        <div className="form-modal__inner">
          <div className="form-modal__top">
            <h3 className="section-title">{title}</h3>
            {closeBtn && (
              <button onClick={handleCloseClick} className="form-modal__close--btn">
                <i className="form-modal__close--icon fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
          <div className="form-modal__content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default FormModal;
