import ContentWrapper from "../../components/ui/content-wrapper";
import { useEffect, useState } from "react";
import { BaseResponseWithoutPagination } from "../../types";
import Table, { Column } from "../../components/ui/table";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { OwnAssignment } from "../../types/assignment";
import DetailAssignmentModal from "../manage-assignment/components/assignment-own-detail";
import assignmentApi from "../../api/ownAssignmentApi";
import DeclineAssignmentModal from "../manage-assignment/components/assignment-own-decline";
import AcceptAssignmentModal from "../manage-assignment/components/assignment-own-accept";
import ReturnAssignmentModal from "../manage-assignment/components/assignment-own-return";
import ChangePasswordModal from "../auth/change-password";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const getColumns = (handlers: {
  onReturn: (row: OwnAssignment) => void;
  onDecline: (row: OwnAssignment) => void;
  onAccept: (row: OwnAssignment) => void;
}): Column<OwnAssignment>[] => [
  { key: "assetCode", title: "Asset Code" },
  { key: "assetName", title: "Asset Name" },
  { key: "category", title: "Category" },
  { key: "assignedDate", title: "Assigned Date" },
  {
    key: "status",
    title: "State",
    // render status labels
    render: (value) => {
      let strValue = String(value);
      if (strValue === "WAITING") {
        strValue = "Waiting for Acceptance";
      }
      if (strValue === "ACCEPTED") {
        strValue = "Accepted";
      }
      return (
        <span>
          {strValue ? strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase() : ""}
        </span>
      );
    },
  },
  // Action column with icons for accepting, declining, and returning assignments
  {
    key: "action",
    actions: [
      {
        // Render a check icon for accepting the assignment
        render: (row) => {
          return (
            <i
              className={`fa-solid fa-check text-red-600 text-3xl font-extrabold ${
                row.status === "ACCEPTED" ? "disabled text-red-600/30 cursor-not-allowed" : ""
              }`}
            ></i>
          );
        },
        onClick: (row) => {
          if (row.status === "WAITING") {
            handlers.onAccept(row);
          }
        },
      },
      {
        // Render a cross icon for declining the assignment
        render: (row) => (
          <button>
            <i
              className={`fa-solid fa-xmark text-black text-3xl font-extrabold ${
                row.status === "ACCEPTED" ? "disabled text-black/30 cursor-not-allowed" : ""
              }`}
            ></i>
          </button>
        ),
        onClick: (row) => {
          if (row.status === "WAITING") {
            handlers.onDecline(row);
          }
        },
      },
      {
        // Render a return icon for returning the assignment
        render: (row) => (
          <i
            className={`fa-solid fa-arrow-rotate-left text-blue-600 text-3xl font-extrabold ${
              row.status === "WAITING" ? "disabled text-blue-600/30 cursor-not-allowed" : ""
            }`}
          ></i>
        ),
        onClick: (row) => {
          if (row.status === "ACCEPTED") {
            handlers.onReturn(row);
          }
        },
      },
    ],
  },
];

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const [assignmentData, setAssignmentData] =
    useState<BaseResponseWithoutPagination<OwnAssignment[]>>();
  const [assignmentId, setAssignmentId] = useState<number>(0);

  const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "assetCode");
  const [sortFieldForApi, setSortFieldForApi] = useState<string>("assetCode");
  const [orderBy, setOrderBy] = useState<string>(searchParams.get("orderBy") || "asc");

  // detail assignment info modal state
  const [showModal, setShowModal] = useState(false);

  // modals for accepting, declining, and returning assignments
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showChangePasswordModal, setChangePasswordModal] = useState(auth.isFirstLogin || false);

  const [isDeclineAssignment, setIsDeclineAssignment] = useState<boolean>(false);

  const handleClickRow = (id: number) => {
    setShowModal(true);
    setAssignmentId(id);
    // Push new state to browser history
    window.history.pushState({ modal: true }, "");
  };

  const handleReturning = () => {
    setAssignmentId(assignmentId);
    setShowReturnModal(true);
  };

  const handleDeclineAssignment = (row: OwnAssignment) => {
    setIsDeclineAssignment(row.status === "DISABLED");
    setAssignmentId(row.id);
    setShowDeclineModal(true);
  };

  const handleAcceptAssignment = (row: OwnAssignment) => {
    setAssignmentId(row.id);
    setShowAcceptModal(true);
  };

  const columns = getColumns({
    onAccept: handleAcceptAssignment,
    onDecline: handleDeclineAssignment,
    onReturn: handleReturning,
  });

  // Function to fetch the assignment list from the API
  const fetchOwnAssignmentList = async () => {
    const response = await assignmentApi.getOwnAssignmentList({
      sortBy: sortFieldForApi,
      orderBy: orderBy,
    });
    console.log("Assignment List Response:", response);

    setAssignmentData(response);
  };

  // Fetch the assignment list when the component mounts or when sortFieldForApi or orderBy changes
  useEffect(() => {
    fetchOwnAssignmentList();
  }, [sortFieldForApi, orderBy]);

  // Update the URL search parameters when sortBy or orderBy changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sortBy", sortBy);
    params.set("orderBy", orderBy);

    const newSearch = params.toString();
    if (location.search !== `?${newSearch}`) {
      navigate(
        {
          pathname: location.pathname,
          search: newSearch,
        },
        { replace: false }
      );
    }
  }, [sortBy, orderBy]);

  // Set initial sortBy and orderBy from search parameters when the component mounts
  useEffect(() => {
    setSortBy(searchParams.get("sortBy") || "assetCode");
    setOrderBy(searchParams.get("orderBy") || "asc");
  }, [searchParams]);

  // Handle browser back button to close modals
  useEffect(() => {
    const handlePopState = () => {
      if (showModal) {
        setShowModal(false);
      }
      if (showDeclineModal) {
        setShowDeclineModal(false);
      }
      if (showAcceptModal) {
        setShowAcceptModal(false);
      }
      if (showReturnModal) {
        setShowReturnModal(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showModal, showDeclineModal, showAcceptModal, showReturnModal]);

  return (
    <>
      {/* This is the main content wrapper for the home page */}
      <ContentWrapper title={"My Assignment"}>
        <div className="flex justify-between items-center w-full mb-[20px]">
          <div className="min-w-[220px]"></div>
        </div>

        {/* Table component to display assignment data */}
        <Table
          columns={columns}
          data={assignmentData?.data ?? []}
          onSort={(key, direction) => {
            setSortBy(key);
            if (key === "assetCode") {
              setSortFieldForApi("assetCode");
            } else {
              setSortFieldForApi(key);
            }
            setOrderBy(direction);
          }}
          onRowClick={(id) => handleClickRow(id)}
          sortBy={sortBy as keyof OwnAssignment}
          orderBy={orderBy}
        />
      </ContentWrapper>

      {/* detail assignment modal */}
      {showModal && (
        <DetailAssignmentModal
          showModal={showModal}
          assignmentId={assignmentId}
          closeModal={() => setShowModal(false)}
        />
      )}

      {/* decline assignment modal */}
      {showDeclineModal && (
        <DeclineAssignmentModal
          isDisable={isDeclineAssignment}
          assignmentId={assignmentId}
          showModal={showDeclineModal}
          onSuccess={() => {
            setShowDeclineModal(false);
            fetchOwnAssignmentList();
          }}
          closeModal={() => setShowDeclineModal(false)}
        />
      )}

      {/* accept assignment modal */}
      {showAcceptModal && (
        <AcceptAssignmentModal
          assignmentId={assignmentId}
          showModal={showAcceptModal}
          onSuccess={() => {
            setShowAcceptModal(false);
            fetchOwnAssignmentList();
          }}
          closeModal={() => setShowAcceptModal(false)}
        />
      )}

      {/* return assignment modal */}
      {showReturnModal && (
        <ReturnAssignmentModal
          assignmentId={assignmentId}
          showModal={showReturnModal}
          onSuccess={() => {
            setShowReturnModal(false);
            fetchOwnAssignmentList();
          }}
          closeModal={() => setShowReturnModal(false)}
        />
      )}

      {/* change password modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isFirstLogin={showChangePasswordModal}
          onClose={() => setChangePasswordModal(false)}
        />
      )}
    </>
  );
};

export default Home;
