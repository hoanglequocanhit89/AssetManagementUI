import Button from "../../../components/ui/button";
import FormInputGroup from "../../../components/ui/form-input-group";
import FormModal from "../../../components/ui/form-modal";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authApi from "../../../api/authApi";
import { LoginDataProps } from "../../../types";
import { login } from "../../../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BigLoading from "../../../components/ui/loading-big/LoadingBig";

const Login = () => {
  const [loginData, setLoginData] = useState<LoginDataProps>({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await authApi.loginAction(loginData)
    .then(response => {
      setIsLoading(false);
      toast.success(response.message);
      dispatch(login(response.data));
      navigate("/home");
    })
    .catch(err => {
      setIsLoading(false);
      toast.error(err.response?.data.message);
    });
  };

  return (
    <>
      <FormModal title="Welcome to Online Asset Management" overlay={false}>
        <form onSubmit={handleLogin} className="form">
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
              type="submit"
              disabled={loginData.username === "" || loginData.password === ""}
            />
          </div>
        </form>
      </FormModal>
      { isLoading && <BigLoading /> }
    </>
  );
};

export default Login;
