import FormModal from "../../../../components/ui/form-modal";
import FormModalGroup from "../../../../components/ui/form-modal-group";
import { Column } from "../../../../components/ui/table";

interface History {
    date: string,
    assignedTo: string,
    assignedBy: string,
    returnedDate: string
};

const columns: Column<History>[] = [
    { key: "date", title: "Date"},
    { key: "assignedTo", title: "Assigned to"},
    { key: "assignedBy", title: "Assigned by"},
    { key: "returnedDate", title: "Returned Date"}
];

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
    // data: DetailAssetData
};



const DetailAssetModal = (props: DetailedAsssetProps) => {

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