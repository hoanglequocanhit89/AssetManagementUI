import "./style.scss";
import React from "react";

interface FormInputGroupProps {
    label: string,
    type: 'text' | 'password';
    required?: boolean 
    onInput: (data: string) => void
}

const FormInputGroup = (props : FormInputGroupProps) => {

    const { label, type, required, onInput } = props;

    const [isPasswordShowing, setIsPasswordShowing] = React.useState<boolean>(false);

    const handleIconClick = () => {
        setIsPasswordShowing(pre => !pre);
    }

    return (
        <div className="form-group"> 
            <label htmlFor={label} className={`form__label ${required ? 'required' : ''}`}>{label}</label>
            <div className="form__input">
                <input onChange={(e) => onInput(e.target.value)} 
                    type={
                        type === 'password' ?
                        isPasswordShowing ? 'text' : 'password'
                        : type
                    } 
                    id={label} 
                    className="form__input--field" 
                    maxLength={128}
                />
                { type === 'password' && 
                    <i onClick={handleIconClick} 
                        className={`fa-solid fa-eye${isPasswordShowing ? '-slash' : ''} form__input--icon`}
                    ></i>
                }
            </div>
        </div>
    )
};

export default FormInputGroup;