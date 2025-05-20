import React, { ReactNode } from "react";

interface FormModalProps {
    title: string,
    value: string | ReactNode;
};

const FormModalGroup = ({ title, value }: FormModalProps) => {


    return (
        <div className="flex gap-[20px] py-[4px]">
            <span className="w-[30%] text-[#8e8f91]">{title}</span>
            {
                typeof (value) === 'string' ?
                    <span className="grow text-[#8e8f91]">{value}</span> :
                    <div className="">{value}</div>
            }
        </div>
    )
};

export default FormModalGroup;