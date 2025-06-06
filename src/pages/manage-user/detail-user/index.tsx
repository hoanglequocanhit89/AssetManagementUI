import { useEffect, useState } from "react";
import userApi from "../../../api/userApi";
import FormModal from "../../../components/ui/form-modal";
import FormModalGroup from "../../../components/ui/form-modal-group";
import { UserDetailResponse } from "../../../types";
import BigLoading from "../../../components/ui/loading-big/LoadingBig";

interface DetailUserProps {
  showModal: boolean;
  closeModal: () => void;
  userId: number;
}

const DetailUser = ({ showModal, closeModal, userId }: DetailUserProps) => {
  const [userData, setUserData] = useState<UserDetailResponse>();
  const [isDetailUserLoading, setIsDetailUserLoading] = useState(true);

  useEffect(() => {
    if (!showModal) return;
    const fetchDetailUser = async () => {
      try {
        setIsDetailUserLoading(true);
        const response = await userApi.getDetailUser(userId);
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsDetailUserLoading(false);
      }
    };
    fetchDetailUser();
  }, [userId, showModal]);

  const fields = [
    { title: "Staff Code", value: userData?.staffCode },
    { title: "Full Name", value: userData?.fullName },
    { title: "Username", value: userData?.username },
    { title: "Email", value: userData?.email },
    { title: "Date of Birth", value: userData?.dob },
    { title: "Gender", value: userData?.gender },
    { title: "Joined Date", value: userData?.joinedDate },
    { title: "Type", value: userData?.role },
    { title: "Location", value: userData?.location },
  ];

  if (!showModal) return null;

  return (
    <div>
      {isDetailUserLoading ? (
        <BigLoading />
      ) : (
        showModal && (
          <FormModal
            title="Detailed User Information"
            closeBtn
            closeModal={() => closeModal()}
          >
            {fields.map((field) => (
              <FormModalGroup
                key={field.title}
                title={field.title}
                value={field.value}
              />
            ))}
          </FormModal>
        )
      )}
    </div>
  );
};

export default DetailUser;
