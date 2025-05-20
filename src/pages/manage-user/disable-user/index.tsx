import Button from "../../../components/ui/button";
import FormModal from "../../../components/ui/form-modal"

interface DisableUserProps {
    showModal: boolean;
    closeModal: () => void;
}

const DisableUser = ({ showModal, closeModal }: DisableUserProps) => {
    const isDisable = false;
    return (
        <div>
            {showModal && <FormModal
                title={isDisable ? "Are you sure ?" : "Can not disable user"}
                closeBtn={!isDisable}
                closeModal={() => closeModal()}
            >
                {
                    isDisable ?
                        <div className="flex flex-col gap-5">
                            <p>Do you want to disable this user?</p>
                            <div className="flex gap-5">
                                <Button
                                    text="Disable"
                                    type="primary"
                                />
                                <Button
                                    text="Cancel"
                                    type="outline"
                                    onClick={() => closeModal()}
                                />
                            </div>
                        </div> :
                        <div className="flex flex-col items-center">
                            <p>There are valid assignments belonging to this user.</p>
                            <p>Please close all assignments before disabling user.</p>
                        </div>
                }
            </FormModal>
            }
        </div>
    )
}

export default DisableUser