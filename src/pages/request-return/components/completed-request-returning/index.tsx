import FormModal from "../../../../components/ui/form-modal";
import Button from "../../../../components/ui/button";

interface CompletedRequestReturningProps {
    id: number,
    closeModal: () => void,
    setRequestReturningList: (id: number) => void
}

const CompletedRequestReturningModal = (props: CompletedRequestReturningProps) => {
    const handleCompletedRequestReturning = async () => {
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

export default CompletedRequestReturningModal