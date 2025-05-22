import React from "react";
import { Link } from "react-router-dom";
import Button from "../../../../components/ui/button";
import FormModal from "../../../../components/ui/form-modal"

interface DeleteAssetProps {
    isDeletable: boolean,
    closeModal: () => void
}

const DeleteAssetModal = (props: DeleteAssetProps) => {
    
    const [isDeletable, setIsDeletable] = React.useState<boolean>(props.isDeletable);

    return (
        <FormModal
            title={isDeletable ? 'Are you sure' : 'Cannot Delete Asset'}
            closeBtn={!isDeletable}
            closeModal={props.closeModal}
        >
        {
            isDeletable ? 
            <>
                <span>Do you want to delete this asset?</span>
                <div className="mt-[40px] flex gap-[20px]">
                    <Button text="Delete" color="primary" onClick={() => console.log('delete asset')} />
                    <Button text="Cancel" color="outline" onClick={props.closeModal} />
                </div>
            </>
            : 
            <>
                <p className="max-w-[480px]">
                    Cannot delete the asset because it belongs to one or more historical assignments.
                    If the asset is not able to be used anymore, please update its state in
                </p>
                <Link to={"/edit-asset"} content="Edit Asset page" />
            </>
        }
        </ FormModal>
    )
};

export default DeleteAssetModal;