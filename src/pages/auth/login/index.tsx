import Button from "../../../components/ui/button";
import FormInputGroup from "../../../components/ui/form-input-group";
import FormModal from "../../../components/ui/form-modal";
import React from "react";
import { useDispatch } from "react-redux";
import authApi from "../../../api/authApi";
import { LoginDataProps } from "../../../types";
import { login } from "../../../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = React.useState<LoginDataProps>({ username: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    console.log("Login data:", loginData);

    const response = await authApi.loginAction(loginData);
    if (!response.data) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      navigate("/home");
      response.data && dispatch(login(response.data));
    }
  };

  return (
    <FormModal title="Welcome to Online Asset Management" overlay={false}>
      <div className="form">
        <FormInputGroup
          label="Username"
          type="text"
          required
          onInput={(data) => setLoginData({ ...loginData, username: data })}
        />
        <FormInputGroup
          label="Password"
          type="password"
          required
          onInput={(data) => setLoginData({ ...loginData, password: data })}
        />
        <div className="form--action">
          <Button
            color="primary"
            text="Login"
            type="button"
            onClick={handleLogin}
            disabled={loginData.username === "" || loginData.password === ""}
          />
        </div>
      </div>
    </FormModal>
  );
};

export default Login;
