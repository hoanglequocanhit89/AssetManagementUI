import FormModal from "../../../components/ui/form-modal"

interface DetailUserProps {
    showModal: boolean;
    closeModal: () => void;
}

const DetailUser = ({ showModal, closeModal }: DetailUserProps) => {
    return (
        <div>
            {showModal && <FormModal
                title="Detailed User Information"
                closeBtn
                closeModal={() => closeModal()}
            >
                User detial here
            </FormModal>
            }
        </div>
    )
}

export default DetailUser