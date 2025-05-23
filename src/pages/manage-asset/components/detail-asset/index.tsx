import FormModal from "../../../../components/ui/form-modal";
import FormModalGroup from "../../../../components/ui/form-modal-group";
import Table, { Column } from "../../../../components/ui/table";
import { AssetDetail, History } from "../../../../types/asset";

interface DetailedAsssetProps {
    closeModal: () => void
    data: AssetDetail
};

const columns: Column<History>[] = [
    { key: "assignedDate", title: "Date"},
    { key: "assignedTo", title: "Assigned to"},
    { key: "assignedBy", title: "Assigned by"},
    { key: "returnedDate", title: "Returned Date"}
];

const DetailAssetModal = (props: DetailedAsssetProps) => {

    const { assetCode, name, category, installedDate, status, location, specification, assignments } = props.data;

    return (
        <FormModal 
            title="Detailed Asset Information"  
            closeBtn
            closeModal={props.closeModal}
        >
            <FormModalGroup title="Asset Code" value={assetCode} />
            <FormModalGroup title="Asset Name" value={name} />
            <FormModalGroup title="Category" value={category} />
            <FormModalGroup title="Installed Date" value={installedDate} />
            <FormModalGroup title="State" value={status} />
            <FormModalGroup title="Location" value={location} />
            <FormModalGroup title="Specification" value={specification} />
            <FormModalGroup 
                title="History" 
                value={ <Table columns={columns} isSort={false} data={assignments} /> } 
            />
        </FormModal>
    )
};

export default DetailAssetModal;