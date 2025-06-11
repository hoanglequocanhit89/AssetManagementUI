import { toast } from "react-toastify"
import requestReturningApi from "../../../../api/requestReturningApi"
import Button from "../../../../components/ui/button"
import FormModal from "../../../../components/ui/form-modal"

interface CancelRequestReturningProps {
    id: number,
    closeModal: () => void,
    setRequestReturningList: (id: number) => void
}

const CancelRequestReturningModal = (props: CancelRequestReturningProps) => {
    const handleCancelRequestReturning = async () => {
        try {
            const response = await requestReturningApi.CancelRequestReturningModal(props.id);
            if (response) {
                toast.success(response.message || "Request returning cancel successfully!");
                props.setRequestReturningList(props.id);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to canceling request returning.");
        } finally {
            props.closeModal();
         }


    }

    return (
        <FormModal
            title="Are you sure?"
            closeBtn
            closeModal={props.closeModal}
        >
            <span>Do you want to 'cancel' this returning request?</span>
            <div className="mt-[40px] flex gap-[20px]">
                <Button text="Yes" color="primary" onClick={handleCancelRequestReturning} />
                <Button text="No" color="outline" onClick={props.closeModal} />
            </div>

        </FormModal>
    )
}

export default CancelRequestReturningModal;