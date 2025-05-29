import { useNavigate } from "react-router-dom";
import assignmentApi from "../../../../api/ownAssignmentApi";
import Button from "../../../../components/ui/button";
import FormModal from "../../../../components/ui/form-modal";

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
  const navigate = useNavigate();
  const handleReturnAssignment = async () => {
    try {
      await assignmentApi.returnOwnAssignment(assignmentId);
      closeModal();
      onSuccess?.();
      // Navigate to the assignment list page after returning
      navigate("request-return");
    } catch (error) {
      console.log(error);
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
