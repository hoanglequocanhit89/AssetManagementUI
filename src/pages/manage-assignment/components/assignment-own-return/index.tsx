import assignmentApi from "../../../../api/ownAssignmentApi";
import Button from "../../../../components/ui/button";
import FormModal from "../../../../components/ui/form-modal";
import { toast } from "react-toastify";

interface ReturnAssignmentModalProps {
  showModal: boolean;
  closeModal: () => void;
  assignmentId: number;
  onSuccess: () => void;
}

const ReturnAssignmentModal = ({
  showModal,
  closeModal,
  assignmentId,
  onSuccess,
}: ReturnAssignmentModalProps) => {
  const handleReturnAssignment = async () => {
    try {
      await assignmentApi.returnOwnAssignment(assignmentId);
      closeModal();
      onSuccess?.();
      toast.success("Request returning successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to request returning assignment.");
    } finally {
      closeModal();
    }
  };
  return (
    <div>
      {showModal && (
        <FormModal title={"Are you sure ?"} closeBtn={true} closeModal={() => closeModal()}>
          <div className="flex flex-col gap-5">
            <p>Do you want to create a returning request for this asset?</p>
            <div className="flex gap-5">
              <Button text="Yes" color="primary" onClick={() => handleReturnAssignment()} />
              <Button text="No" color="outline" onClick={() => closeModal()} />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default ReturnAssignmentModal;
