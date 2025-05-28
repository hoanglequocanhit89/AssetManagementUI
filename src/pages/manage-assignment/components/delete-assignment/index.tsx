import { toast } from "react-toastify"
import assignmentApi from "../../../../api/assignmentApi"
import Button from "../../../../components/ui/button"
import FormModal from "../../../../components/ui/form-modal"

interface DeleteAssignmentProps {
    id: number,
    isDeletable: boolean,
    closeModal: () => void,
    setAssignmentList: (id: number) => void
}

const DeleteAssignmentModal = (props: DeleteAssignmentProps) => {

    const handleDeleteAssignment = async () => {
        try {
            const response = await assignmentApi.deleteAssignment(props.id);
            if (response) {
                toast.success(response.message || "Assignment deleted successfully!");
                props.setAssignmentList(props.id);
                props.closeModal();
            }
        } catch (error) {
            toast.error("Failed to delete assignment.");
            console.error(error);
        }
    }

    return (
        <FormModal
            title="Are you sure?"
            closeBtn
            closeModal={props.closeModal}
        >
            <span> Do you want to delete this assignment?</span>
            <div className="mt-[40px] flex gap-[20px]">
                <Button text="Delete" color="primary" onClick={handleDeleteAssignment} />
                <Button text="Cancel" color="outline" onClick={props.closeModal} />
            </div>
        </FormModal>
    )
}

export default DeleteAssignmentModal;