import React, { ReactNode } from "react";

interface FormModalProps {
    title: string,
    value: string | ReactNode;
};

const FormModalGroup = ({ title, value }: FormModalProps) => {

    return (
        <div className="flex items-start gap-[20px] py-[8px]">
            <span className="w-[30%] text-[#000000]">{title}:</span>
            {
                typeof(value) === 'string' ? 
                ( <span className="grow text-[#000000]">{value}</span> )
                 : 
                ( value )
            }
        </div>
    )
};

export default FormModalGroup;