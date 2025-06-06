import React from "react";
import { useNavigate } from "react-router-dom";
import assetApi from "../../../../api/assetApi";
import Button from "../../../../components/ui/button";
import FormModal from "../../../../components/ui/form-modal";
import { toast } from 'react-toastify';

interface DeleteAssetProps {
    id: number,
    isDeletable: boolean,
    closeModal: () => void,
    setAssetList: (id: number) => void
}

const DeleteAssetModal = (props: DeleteAssetProps) => {

    const [isDeletable] = React.useState<boolean>(props.isDeletable);
    const navigate = useNavigate();

    const handleDeleteAsset = async () => {
        const response = await assetApi.deleteAsset(props.id);
        if (response) {
            toast.success(response.message);
            props.closeModal();
            props.setAssetList(props.id);
        }
    };

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
                            <Button text="Delete" color="primary" onClick={handleDeleteAsset} />
                            <Button text="Cancel" color="outline" onClick={props.closeModal} />
                        </div>
                    </>
                    :
                    <>
                        <p className="max-w-[480px]">
                            Cannot delete the asset because it belongs to one or <br /> more historical assignments.
                            If the asset is not able to <br /> be used anymore, please update its state in
                        </p>
                        <div onClick={() => navigate(`edit/${props.id}`)} className="text-center cursor-pointer"><p className="underline text-blue-400">Edit Asset page</p></div>
                    </>
            }
        </ FormModal>
    )
};

export default DeleteAssetModal;