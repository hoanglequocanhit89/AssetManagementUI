import { ReactNode } from "react";

interface contentWrapperProps {
    title: String,
    children: ReactNode
}

const ContentWrapper = (props: contentWrapperProps) => {
    return (
        <div className="content-wrapper">
            <h2 className="session-title mb-[30px]">{props.title}</h2>
            {props.children}
        </div>
    )
};

export default ContentWrapper;