import React, { ReactNode } from "react";
import "./style.scss";

interface FormModalProps {
    title: string,
    value: string | ReactNode;
};

const FormModalGroup = ({ title, value }: FormModalProps) => {

    return (
        <div className="form-modal__group">
            <span className="form-modal__group--title">{title}:</span>
            {
                typeof(value) === 'string' ? 
                ( <span className="form-modal__group--text">{value}</span> )
                 : 
                ( value )
            }
        </div>
    )
};

export default FormModalGroup;