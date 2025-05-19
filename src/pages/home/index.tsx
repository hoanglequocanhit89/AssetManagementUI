import { useState } from "react";
import ContentWrapper from "../../components/ui/content-wrapper"
import FormModal from "../../components/ui/form-modal";

const Home = () => {

    const [showModal, setShowModal] = useState(true);

    return (
        <ContentWrapper title={'My Assignment'}>
            <h1>heloo</h1>
            {
                showModal &&
                <FormModal 
                    title="Detailed User Information" 
                    closeBtn
                    closeModal={() => setShowModal(false)}
                >
                    <div onClick={() => setShowModal(true)}>heelo</div>
                </FormModal>
            }
        </ContentWrapper>
    )
};

export default Home;