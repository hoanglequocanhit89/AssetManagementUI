import React, { ReactNode } from "react";

interface FormModalProps {
    title: string,
    value: string | ReactNode;     
};

const FormModalGroup = ({ title, value }: FormModalProps) => {


    return (
<<<<<<< HEAD
        <div className="flex gap-[20px] py-[4px]">
            <span className="w-[30%] text-[#8e8f91]">{title}</span>
            {
                typeof(value) === 'string' ? 
                <span className="grow text-[#8e8f91]">{value}</span> : 
=======
        <div className="form-modal__group">
            <span className="form-modal__group--text">{title}</span>
            {
                typeof(value) === 'string' ? 
                <span className="form-modal__group--text">{value}</span> : 
>>>>>>> 6323c57a77aa7fce8028b2ec5022d35601e77ca0
                <div className="">{value}</div>
            }
        </div>
    )
};

export default FormModalGroup;