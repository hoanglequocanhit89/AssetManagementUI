import { data } from "react-router-dom";
import FormModal from "../../../../components/ui/form-modal";
import FormModalGroup from "../../../../components/ui/form-modal-group";
import Table, { Column } from "../../../../components/ui/table";

interface History {
    id: number,
    date: string,
    assignedTo: string,
    assignedBy: string,
    returnedDate: string
};

interface DetailAssetData {
    assetCode: string,
    assetName: string,
    category: string,
    installedDate: string,
    state: string,
    location: string,
    specification: string,
    history: History[]
};

interface DetailedAsssetProps {
    closeModal: () => void
    data: DetailAssetData
};

const columns: Column<History>[] = [
    { key: "date", title: "Date"},
    { key: "assignedTo", title: "Assigned to"},
    { key: "assignedBy", title: "Assigned by"},
    { key: "returnedDate", title: "Returned Date"}
];

const DetailAssetModal = (props: DetailedAsssetProps) => {

    const { assetCode, assetName, category, installedDate, state, location, specification, history } = props.data;

    return (
        <FormModal 
            title="Detailed Asset Information"  
            closeBtn
            closeModal={props.closeModal}
        >
            <FormModalGroup title="Asset Code" value={assetCode} />
            <FormModalGroup title="Asset Name" value={assetName} />
            <FormModalGroup title="Category" value={category} />
            <FormModalGroup title="Installed Date" value={installedDate} />
            <FormModalGroup title="State" value={state} />
            <FormModalGroup title="Location" value={location} />
            <FormModalGroup title="Specification" value={specification} />
            <FormModalGroup 
                title="History" 
                value={ <Table columns={columns} data={history} /> } 
            />
        </FormModal>
    )
};

export default DetailAssetModal;