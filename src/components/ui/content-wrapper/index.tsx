import { ReactNode } from "react";

interface contentWrapperProps {
    title: String,
    children: ReactNode
}

const ContentWrapper = (props: contentWrapperProps) => {
    return (
        <div className="content-wrapper h-full flex flex-col">
            <h2 className="section-title mb-[30px]">{props.title}</h2>
            {props.children}
        </div>
    )
};

export default ContentWrapper;