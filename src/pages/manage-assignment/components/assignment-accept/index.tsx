import assignmentApi from "../../../../api/assignmentApi";
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
      await assignmentApi.acceptAssignment(assignmentId);
      closeModal();
      onSuccess?.();
    } catch (error) {
      console.log(error);
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
