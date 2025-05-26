import { useState } from "react";
import ContentWrapper from "../../components/ui/content-wrapper"
import FormModal from "../../components/ui/form-modal";
import FormModalWithSearch from "../../components/ui/form-modal-with-search";


const Home = () => {

    const [showModal, setShowModal] = useState(false);

    return (
        <ContentWrapper title={'My Assignment'}>
            <button onClick={() => setShowModal(true)}>ShowModal</button>
            <h1>heloo</h1>
            {
                showModal &&

                // <FormModal 
                //     title="Detailed User Information" 
                //     closeBtn={true}
                //     closeModal={() => setShowModal(false)}
                // >
                //     <div>heelo</div>
                // </FormModal>

                <FormModalWithSearch 
                    title="Title" 
                    onSearchInput={(data) => console.log(data)}
                    onSubmit={() => console.log('submit')}
                    closeModal={() => setShowModal(false)}
                >
                    <div className="">Hello</div>
                </FormModalWithSearch>
            }
        </ContentWrapper>
    )
};

export default Home;