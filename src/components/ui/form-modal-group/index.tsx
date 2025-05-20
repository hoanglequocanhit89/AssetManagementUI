import React, { ReactNode } from "react";

interface FormModalProps {
    title: string,
    value: string | ReactNode;     
};

const FormModalGroup = ({ title, value }: FormModalProps) => {


    return (
        <div className="form-modal__group">
            <span className="form-modal__group--text">{title}</span>
            {
                typeof(value) === 'string' ? 
                <span className="form-modal__group--text">{value}</span> : 
                <div className="">{value}</div>
            }
        </div>
    )
};

export default FormModalGroup;