import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import authApi from "../../../api/authApi";
import Button from "../../../components/ui/button";
import FormInputGroup from "../../../components/ui/form-input-group";
import FormModal from "../../../components/ui/form-modal";
import BigLoading from "../../../components/ui/loading-big/LoadingBig";
import { changePassword, logout } from "../../../store/slices/authSlice";
import { ChangePasswordProps } from "../../../types";

interface ChangePasswordModalProps {
  onClose: () => void;
  isFirstLogin?: boolean | false;
}

const ChangePasswordModal = (props: ChangePasswordModalProps) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [changePasswordData, setChangePasswordData] = useState<ChangePasswordProps>({
    oldPassword: "",
    newPassword: "",
  });

  const handleChangePasswordAction = async () => {
    setIsLoading(true);
    if(props.isFirstLogin) {
      await authApi.changeFirstPasswordAction(changePasswordData)
        .then(response => {
          setIsLoading(false);
          toast.success(response.message);
          dispatch(changePassword());
          props.onClose();
        })
        .catch(err => {
          setIsLoading(false);
          toast.error(err.response?.data.message)
        });
    } else {
      await authApi.changePasswordAction(changePasswordData)
        .then(response => {
          setIsLoading(false);
          toast.success(response.message);
          response && dispatch(logout());
        })
        .catch(err => {
          setIsLoading(false);
          toast.error(err.response?.data.message);
        });
    }
  };

  return (
    <>
      <FormModal title="Change password">
        <div className="form">
          {props.isFirstLogin ? (
            <>
              <p className="form__text">This is the first time you logged in.</p>
              <p className="form__text">You have to change your password to continue.</p>
              <FormInputGroup
                label="New password"
                required
                onInput={(data) =>
                  setChangePasswordData({ ...changePasswordData, newPassword: data })
                }
                type="password"
              />
            </>
          ) : (
            <>
              <FormInputGroup
                label="Old password"
                onInput={(data) =>
                  setChangePasswordData({ ...changePasswordData, oldPassword: data })
                }
                type="password"
              />
              <FormInputGroup
                label="New password"
                onInput={(data) =>
                  setChangePasswordData({ ...changePasswordData, newPassword: data })
                }
                type="password"
              />
            </>
          )}
          <div className="form--action">
            <Button
              color="primary"
              text="Save"
              disabled={
                props.isFirstLogin ?
                changePasswordData.newPassword === ""
                :
                changePasswordData.oldPassword === "" || changePasswordData.newPassword === ""
              }
              onClick={handleChangePasswordAction}
            />
            {
              !props.isFirstLogin && 
              <Button
                color="outline"
                text="Cancel"
                onClick={props.onClose}
              />
            }
          </div>
        </div>
      </FormModal>
      { isLoading && <BigLoading /> }
    </>
  );
};

export default ChangePasswordModal;
