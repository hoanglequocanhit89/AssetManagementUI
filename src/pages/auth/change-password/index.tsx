import { useState } from "react";
import authApi from "../../../api/authApi";
import Button from "../../../components/ui/button";
import FormInputGroup from "../../../components/ui/form-input-group";
import FormModal from "../../../components/ui/form-modal";
import { ChangePasswordProps } from "../../../types";

interface ChangePasswordModalProps {
    onClose: () => void,
    isFirstLogin?: boolean | false
}

const ChangePasswordModal = (props: ChangePasswordModalProps) => {

    const [changePasswordData, setChangePasswordData] = useState<ChangePasswordProps>({ oldPassword: '', newPassword: '' });

    const handleChangePasswordAction = async () => {
        const response = await authApi.changePasswordAction(changePasswordData);
        console.log(response);
    }

    return (
        <FormModal title="Change password" >
            <div className="form">
                {
                    props.isFirstLogin ?
                    <>
                        
                        <p className="form__text">This is the first time you logged in.</p>
                        <p className="form__text">You have to change your password to continune.</p>
                        <FormInputGroup 
                            label="New password" 
                            required
                            onInput={(data) => setChangePasswordData({ ...changePasswordData, newPassword: data })} 
                            type="password"
                        />
                    </>
                    :
                    <>
                        <FormInputGroup 
                            label="Old password" 
                            onInput={(data) => setChangePasswordData({ ...changePasswordData, oldPassword: data })} 
                            type="password"
                        />
                        <FormInputGroup 
                            label="New password" 
                            onInput={(data) => setChangePasswordData({ ...changePasswordData, newPassword: data })} 
                            type="password"
                        />
                    </>
                }
                <div className="form--action">
                    <Button color="primary" text="Save" 
                        disabled={changePasswordData.oldPassword === '' || 
                        changePasswordData.newPassword === ''} 
                        onClick={handleChangePasswordAction}
                    />
                    {
                        !props.isFirstLogin &&
                        <Button color="outline" text="Cancel" onClick={props.onClose} />
                    }
                </div>
            </div>
        </FormModal>
    )
};

export default ChangePasswordModal;