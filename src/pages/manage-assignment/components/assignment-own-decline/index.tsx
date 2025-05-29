import { toast } from "react-toastify";
import assignmentApi from "../../../../api/ownAssignmentApi";
import Button from "../../../../components/ui/button";
import FormModal from "../../../../components/ui/form-modal";

interface DeclineAssignmentProps {
  showModal: boolean;
  closeModal: () => void;
  isDisable: boolean;
  assignmentId: number;
  onSuccess: () => void;
}

const DeclineAssignmentModal = ({
  showModal,
  closeModal,
  isDisable,
  assignmentId,
  onSuccess,
}: DeclineAssignmentProps) => {
  const handleDeclineAssignment = async () => {
    try {
      await assignmentApi.responseOwnAssignment(assignmentId, "DECLINED");
      closeModal();
      onSuccess?.();
      toast.success("Assignment declined successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to decline assignment.");
    } finally {
      closeModal();
    }
  };
  return (
    <div>
      {showModal && (
        <FormModal
          title={isDisable ? "Are you sure ?" : "Can not decline assignment"}
          closeBtn={!isDisable}
          closeModal={() => closeModal()}
        >
          <div className="flex flex-col gap-5">
            <p>Do you want to decline this assignment?</p>
            <div className="flex gap-5">
              <Button text="Decline" color="primary" onClick={() => handleDeclineAssignment()} />
              <Button text="Cancel" color="outline" onClick={() => closeModal()} />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default DeclineAssignmentModal;
