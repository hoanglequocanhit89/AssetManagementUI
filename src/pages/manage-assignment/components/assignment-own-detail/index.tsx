import { useEffect, useState } from "react";
import { OwnAssignmentDetail } from "../../../../types/assignment";
import assignmentApi from "../../../../api/ownAssignmentApi";
import FormModal from "../../../../components/ui/form-modal";
import FormModalGroup from "../../../../components/ui/form-modal-group";

interface DetailOwnAssignmentProps {
  showModal: boolean;
  closeModal: () => void;
  assignmentId: number;
}

const DetailUser = ({ showModal, closeModal, assignmentId }: DetailOwnAssignmentProps) => {
  const [assignmentData, setAssignmentData] = useState<OwnAssignmentDetail>();

  useEffect(() => {
    if (!showModal) return;
    const fetchDetailUser = async () => {
      try {
        const response = await assignmentApi.getOwnAssignmentDetail(assignmentId);
        setAssignmentData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailUser();
  }, [assignmentId, showModal]);

  const fields = [
    { title: "Asset Code", value: assignmentData?.assetCode },
    { title: "Asset Name", value: assignmentData?.assetName },
    { title: "Specification", value: assignmentData?.specification },
    { title: "Assigned To", value: assignmentData?.assignedTo },
    { title: "Assigned By", value: assignmentData?.assignedBy },
    { title: "Assigned Date", value: assignmentData?.assignedDate },
    { title: "State", value: assignmentData?.status },
    { title: "Note", value: assignmentData?.note || "No note provided" },
  ];

  if (!showModal) return null;

  return (
    <div>
      {showModal && (
        <FormModal title="Detailed assignment Information" closeBtn closeModal={() => closeModal()}>
          {fields.map((field) => (
            <FormModalGroup key={field.title} title={field.title} value={field.value} />
          ))}
        </FormModal>
      )}
    </div>
  );
};

export default DetailUser;
