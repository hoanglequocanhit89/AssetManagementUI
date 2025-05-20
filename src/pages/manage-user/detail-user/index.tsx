import FormModal from "../../../components/ui/form-modal"
import FormModalGroup from "../../../components/ui/form-modal-group";

interface DetailUserProps {
    showModal: boolean;
    closeModal: () => void;
}

const fields = [
    { title: "Staff Code", value: 'SD101' },
    { title: "Full Name", value: '' },
    { title: "Username", value: '' },
    { title: "Date of Birth", value: '' },
    { title: "Gender", value: '' },
    { title: "Joined Date", value: '' },
    { title: "Type", value: '' },
    { title: "Location", value: '' },
];

const DetailUser = ({ showModal, closeModal }: DetailUserProps) => {
    return (
        <div>
            {showModal && <FormModal
                title="Detailed User Information"
                closeBtn
                closeModal={() => closeModal()}
            >
                {fields.map((field) => (
                    <FormModalGroup
                        key={field.title}
                        title={field.title}
                        value={field.value}
                    />
                ))}

            </FormModal>
            }
        </div>
    )
}

export default DetailUser