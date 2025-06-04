import { useNavigate } from "react-router-dom";
import Button from "../../../../components/ui/button";
import FormModal from "../../../../components/ui/form-modal";
import { toast } from "react-toastify";
import assignmentApi from "../../../../api/assignmentApi";

interface ReturnAssignmentModalProps {
  showModal: boolean;
  closeModal: () => void;
  assignmentId: number;
  onSuccess: () => void;
}

const ReturnAdminAssignmentModal = ({
  showModal,
  closeModal,
  assignmentId,
  onSuccess,
}: ReturnAssignmentModalProps) => {
  const navigate = useNavigate();
  const handleReturnAssignment = async () => {
    try {
      await assignmentApi.returnAssignmentForAdmin(assignmentId);
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

export default ReturnAdminAssignmentModal;