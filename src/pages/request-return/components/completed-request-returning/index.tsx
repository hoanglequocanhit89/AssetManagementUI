import FormModal from "../../../../components/ui/form-modal";
import Button from "../../../../components/ui/button";
import requestReturningApi from "../../../../api/requestReturningApi";
import { toast } from "react-toastify";

interface CompletedRequestReturningProps {
    id: number,
    closeModal: () => void,
    setRequestReturningList: (id: number) => void
}

const CompletedRequestReturningModal = (props: CompletedRequestReturningProps) => {
    const handleCompletedRequestReturning = async () => {
        try {
            const response = await requestReturningApi.CompletedRequestReturning(props.id);
            if (response) {
                toast.success(response.message || "Request returning completed successfully!");
                props.setRequestReturningList(props.id);
                props.closeModal();
            }
        } catch (error) {
            toast.error("Failed to completed request returning.");
            console.error(error);
        }
    }

    return (
        <FormModal
            title="Are you sure?"
            closeBtn
            closeModal={props.closeModal}
        >
            <span>Do you want to mark this returning request as 'Completed'?</span>
            <div className="mt-[40px] flex gap-[20px]">
                <Button text="Yes" color="primary" onClick={handleCompletedRequestReturning} />
                <Button text="No" color="outline" onClick={props.closeModal} />
            </div>
        </FormModal>
    )
}

export default CompletedRequestReturningModal;