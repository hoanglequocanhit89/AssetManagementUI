import { data } from "react-router-dom";
import FormModal from "../../../../components/ui/form-modal";
import FormModalGroup from "../../../../components/ui/form-modal-group";
import Table, { Column } from "../../../../components/ui/table";

interface History {
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

interface DetailAssetTitle {
    assetCode: string,
    assetName: string,
    category: string,
    installedDate: string,
    state: string,
    location: string,
    specification: string,
    history: string
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

const titles: DetailAssetTitle = {
    assetCode: 'Asset Code',
    assetName: 'Asset Name',
    category: 'Category',
    installedDate: 'Installed Date',
    state: 'Available',
    location: 'Location',
    specification: 'Specification',
    history: 'History'
};

const DetailAssetModal = (props: DetailedAsssetProps) => {

    // const historyTable = <Table columns={columns} data={props.data} />;

    return (
        <FormModal 
            title="Detailed Asset Information"  
            closeBtn
            closeModal={props.closeModal}
        >

            <FormModalGroup title="Asset Code" value="LA100001" />
            <FormModalGroup title="Asset Name" value={<h1>Hello</h1>} />
        </FormModal>
    )
};

export default DetailAssetModal;