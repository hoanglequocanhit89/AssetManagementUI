import FormModal from "../../../../components/ui/form-modal"
import FormModalGroup from "../../../../components/ui/form-modal-group"
import { AssignmentDetail } from "../../../../types/assignment"
import { getStatusLabel } from "../../../../utils/status-label"

interface DetailedAssignmentProps {
    closeModal: () => void
    data: AssignmentDetail
}

const DetailAssignmentModal = (props: DetailedAssignmentProps) => {

    const {assetCode, assetName, specification, assignedTo, assignedBy, assignedDate, status, note} = props.data

    return(
        <FormModal
            title="Detail Assignment Information"
            closeBtn
            closeModal={props.closeModal}
        >
            <FormModalGroup title="Asset Code" value={assetCode}/>
            <FormModalGroup title="Asset Name" value={assetName}/>
            <FormModalGroup title="Specification" value={specification}/>
            <FormModalGroup title="Assigned To" value={assignedTo}/>
            <FormModalGroup title="Assigned By" value={assignedBy}/>
            <FormModalGroup title="Assigned Date" value={assignedDate}/>
            <FormModalGroup title="State" value={getStatusLabel(status)}/>
            <FormModalGroup title="Note" value={note}/>
        </FormModal>
    )
}

export default DetailAssignmentModal