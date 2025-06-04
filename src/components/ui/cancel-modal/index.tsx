import FormModal from "../form-modal";
import Button from "../button";
import { useEscapeKey } from "../../../hooks/useEscapeKey";

interface CancelModalProps {
  content: string;
  showModal: boolean;
  closeModal: () => void;
  onSuccess: () => void;
}

const CancelModal = ({
  content,
  showModal,
  closeModal,
  onSuccess,
}: CancelModalProps) => {
  useEscapeKey(closeModal);
  return (
    <div>
      {showModal && (
        <FormModal
          closeBtn={true}
          title={"Are you sure?"}
          closeModal={() => closeModal()}
        >
          {
            <div className="flex flex-col gap-5">
              <p>{content}</p>
              <div className="flex gap-5">
                <Button text="Yes" color="primary" onClick={onSuccess} />
                <Button
                  text="Cancel"
                  color="outline"
                  onClick={() => closeModal()}
                />
              </div>
            </div>
          }
        </FormModal>
      )}
    </div>
  );
};

export default CancelModal;
