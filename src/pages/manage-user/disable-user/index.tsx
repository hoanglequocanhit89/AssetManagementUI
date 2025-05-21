import userApi from "../../../api/userApi";
import Button from "../../../components/ui/button";
import FormModal from "../../../components/ui/form-modal"

interface DisableUserProps {
    showModal: boolean;
    closeModal: () => void;
    isDisable: boolean;
    userId: number;
    onSuccess: () => void;
}

const DisableUser = ({ showModal, closeModal, isDisable, userId, onSuccess }: DisableUserProps) => {

    const handleDisableUser = async () => {
        try {
            await userApi.disableUser(userId)
            onSuccess?.()
        } catch (error) {
            console.log(error)
        }
    }
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
                                    color="primary"
                                    onClick={() => handleDisableUser()}
                                />
                                <Button
                                    text="Cancel"
                                    color="outline"
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