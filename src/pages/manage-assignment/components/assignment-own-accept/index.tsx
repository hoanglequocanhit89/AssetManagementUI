import { toast } from "react-toastify";
import assignmentApi from "../../../../api/ownAssignmentApi";
import Button from "../../../../components/ui/button";
import FormModal from "../../../../components/ui/form-modal";

interface AcceptAssignmentProps {
  showModal: boolean;
  closeModal: () => void;
  assignmentId: number;
  onSuccess: () => void;
}

const AcceptAssignmentModal = ({
  showModal,
  closeModal,
  assignmentId,
  onSuccess,
}: AcceptAssignmentProps) => {
  const handleAcceptAssignment = async () => {
    try {
      await assignmentApi.responseOwnAssignment(assignmentId, "ACCEPTED");
      onSuccess?.();
      toast.success("Assignment accepted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to accept assignment.");
    } finally {
      closeModal();
    }
  };
  return (
    <div>
      {showModal && (
        <FormModal title={"Are you sure ?"} closeBtn={true} closeModal={() => closeModal()}>
          <div className="flex flex-col gap-5">
            <p>Do you want to accept this assignment?</p>
            <div className="flex gap-5">
              <Button text="Accept" color="primary" onClick={() => handleAcceptAssignment()} />
              <Button text="Cancel" color="outline" onClick={() => closeModal()} />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default AcceptAssignmentModal;
