import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper";
import DateFilter from "../../components/ui/date-filter";
import SearchInput from "../../components/ui/search";
import SelectFilter from "../../components/ui/select-filter";
import Table, { Column } from "../../components/ui/table";
import React, { useEffect, useState } from "react";
import assignmentApi from "../../api/assignmentApi";
import Pagination from "../../components/ui/pagination";
import { Assignment, AssignmentDetail } from "../../types/assignment";
import DetailAssignmentModal from "./components/detail-assignment";
import DeleteAssignmentModal from "./components/delete-assignment";
import { useDebounce } from "../../hooks/useDebounce";
import { getStatusLabel } from "../../utils/status-label";
import ReturnAdminAssignmentModal from "./components/assignment-admin-return";
import BigLoading from "../../components/ui/loading-big/LoadingBig";
import PageSizeSelect from "../../components/ui/page-size-select";

const getColumns = (props: {
  handlers: {
    onEdit: (row: Assignment) => void;
    onDelete: (row: Assignment) => void;
    onReturn: (row: Assignment) => void
  };
  pagingData: PagingProps;
}): Column<Assignment>[] => {
  const { handlers, pagingData } = props;
  return [
    {
      key: "id",
      fixed: 'left',
      title: "No.",
      width: 50,
      render: (_value, _row, index: number) => (pagingData.currentPage - 1) * 20 + index + 1,
    },
    { key: "assetCode", title: "Asset Code", fixed: "left", width: 60 },
    { key: "assetName", title: "Asset Name" },
    { key: "assignedTo", title: "Assigned to" },
    { key: "assignedBy", title: "Assigned By" },
    { key: "assignedDate", title: "Assigned Date" },
    {
      key: "status",
      title: "State",
      render: (value) => {
        return <span>{getStatusLabel(String(value))}</span>
      }
    },
    {
      key: "action",
      fixed: "right",
      actions: [
        {
          render: (row) => {
            const isDisabled = row.status === "ACCEPTED" || row.status === "DECLINED" || row.status === "RETURNED";
            return (
              <button disabled={isDisabled}>
                <i
                  className={`fa-solid fa-pen ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Edit"
                ></i>
              </button>
            );
          },
          onClick: handlers.onEdit,
        },
        {
          render: (row) => {
            const isDisabled = row.status === "ACCEPTED" || row.status === "RETURNED";
            return (
              <button disabled={isDisabled}>
                <i
                  className={`fa-regular fa-circle-xmark text-[var(--primary-color)] ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  title="Delete"
                ></i>
              </button>
            );
          },
          onClick: handlers.onDelete,
        },
        {
          render: (row) => {
            const isDisabled = row.status === "RETURNED" || row.status === "WAITING_FOR_RETURNING" || row.status === "WAITING";
            return (
              <button disabled={isDisabled}>
                <i className={`fa-solid fa-rotate-left text-blue-600 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`} title="Return"></i>
              </button>
            );
          },
          onClick: handlers.onReturn,
        },
      ],
    },
  ];
};

const stateArr = [
  {
    value: "ACCEPTED",
    label: "Accepted",
  },
  {
    value: "WAITING",
    label: "Waiting for acceptance",
  },
  {
    value: "DECLINED",
    label: "Declined",
  },
  {
    value: "",
    label: "All",
  },
];

interface SortFilterProps {
  sortBy: string;
  sortDir: string;
}

interface PagingProps {
  currentPage: number;
  totalPage: number;
}

const ManageAssignment = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editAssignmentId, setEditAssignmentId] = React.useState<number>(0);
  const [isAssignementDeletetable, setIsAssetDeletetable] = React.useState<boolean>(false);
  const [viewDetailModal, setViewDetailModal] = React.useState<boolean>(false);
  const [viewDeleteModal, setViewDeleteModal] = React.useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [stateFilter, setStateFilter] = React.useState<string>(searchParams.get("states") || "");
  const [searchFilter, setSearchFilter] = React.useState<string>(searchParams.get("keyword") || "");
  const [assignmentList, setAssignementList] = React.useState<Assignment[]>([]);
  const [sortFilter, setSortFilter] = React.useState<SortFilterProps>({
    sortBy: searchParams.get("sortBy") || "assetCode",
    sortDir: searchParams.get("sortDir") || "asc",
  });
  const [pagingData, setPagingData] = React.useState<PagingProps>({
    currentPage: Number(searchParams.get("page")) || 1,
    totalPage: 0,
  });
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get("size")) || 20);
  const [assignedDateFilter, setAssignedDateFilter] = React.useState<Date | undefined>(undefined);
  const [detailAssignmentData, setDetailAssignmentData] = React.useState<AssignmentDetail>({
    id: 0,
    assetCode: "",
    assetName: "",
    assignedTo: "",
    assignedBy: "",
    assignedDate: "",
    status: "",
    specification: "",
    note: "",
    canDelete: false,
  });
  const [isDetailAssignmentLoading, setIsDetailAssignmentLoading] = useState(false);

  const [showReturnModal, setShowReturnModal] = useState(false);

  const debouncedKeyword = useDebounce(searchFilter, 500);
  const navigate = useNavigate();

  const fetchAssignmentList = async () => {
    const formatDateToLocalString = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    try {
      const tempAsset = location.state?.tempAsset;
      const response = await assignmentApi.getAssignmentList({
        status: stateFilter || undefined,
        assignedDate: assignedDateFilter ? formatDateToLocalString(assignedDateFilter) : undefined,
        query: searchFilter || undefined,
        page: pagingData.currentPage - 1,
        size: pageSize,
        sortBy: sortFilter.sortBy || "assetCode",
        sortDir: sortFilter.sortDir || "asc",
      });
      if (response.data) {
        if (tempAsset) {
          response.data.content = response.data.content.filter(
            (a) => a.id !== tempAsset.id
          )
          response.data.content.unshift(tempAsset);
          setAssignementList(response.data.content);
        } else {
          setAssignementList(response.data.content);
        }
        setPagingData((prev) => ({
          ...prev,
          totalPage: response.data.totalPages,
        }));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setStateFilter(searchParams.get("states") || "");
    setPagingData({ currentPage: Number(searchParams.get("page")) || 1, totalPage: 0 });
    setSearchFilter(searchParams.get("keyword") || "");
    setSortFilter({
      sortBy: searchParams.get("sortBy") || "assetCode",
      sortDir: searchParams.get("sortDir") || "asc",
    });
    setPageSize(Number(searchParams.get("size")) || 20);
    assignmentList.length = 0;
    setIsLoading(true);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("keyword", debouncedKeyword);
    params.set("states", stateFilter);
    params.set("page", pagingData.currentPage.toString());
    params.set("sortBy", sortFilter.sortBy);
    params.set("sortDir", sortFilter.sortDir);
    params.set("size", pageSize.toString());
    const newSearch = params.toString();

    const formatDateToLocalString = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`; // Output: 2025-04-20
    };

    if (assignedDateFilter) {
      params.set("assignedDate", formatDateToLocalString(assignedDateFilter));
    }

    if (location.search !== `?${newSearch}`) {
      navigate(
        {
          pathname: location.pathname,
          search: newSearch,
        },
        { replace: false }
      );
    }
    assignmentList.length = 0;
    setIsLoading(true);
    fetchAssignmentList();
  }, [
    stateFilter,
    debouncedKeyword,
    sortFilter.sortBy,
    sortFilter.sortDir,
    pagingData.currentPage,
    assignedDateFilter,
    pageSize
  ]);

  const handleEdit = (row: Assignment) => {
    navigate(`edit/${row.id}`);
  };

  const handleDelete = async (row: Assignment) => {
    setEditAssignmentId(row.id);
    setIsAssetDeletetable(row.canDelete);
    setViewDeleteModal(true);
  };

  const handleReturn = (row: Assignment) => {
    setEditAssignmentId(row.id);
    setShowReturnModal(true);
  }

  const columns = getColumns({
    handlers: {
      onEdit: handleEdit,
      onDelete: handleDelete,
      onReturn: handleReturn
    },
    pagingData: pagingData,
  });

  const handleSort = (key: string, direction: string) => {
    setSortFilter({ ...sortFilter, sortBy: key, sortDir: direction });
  };

  const handleOnRowClick = async (id: number) => {
    setViewDetailModal(true);
    window.history.pushState({ modal: true }, "");
    try {
      setIsDetailAssignmentLoading(true);
      const response = await assignmentApi.getAssignmentDetail(id);
      setDetailAssignmentData({ ...response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDetailAssignmentLoading(false);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (viewDetailModal) {
        setViewDetailModal(false);
      }
      if (viewDeleteModal) {
        setViewDeleteModal(false);
      }
      if (showReturnModal) {
        setShowReturnModal(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [viewDetailModal, viewDeleteModal]);

  return (
    <>
      <ContentWrapper title={"Assignment List"}>
        <div className="d-flex gap-[20px] mb-[20px] z-20">
          <SelectFilter
            placeholder="State"
            options={stateArr}
            onSelect={(value) => setStateFilter(value)}
            selected={stateFilter}
          />
          <DateFilter
            label="Assigned Date"
            selectedDate={assignedDateFilter}
            onSelect={(date) => setAssignedDateFilter(date)}
            isHighlight={false}
          />
          <SearchInput value={searchFilter} onSearch={(data) => setSearchFilter(data)} />
          <Button text="Create new assignment" color="primary" onClick={() => navigate("create")} />
        </div>
        <Table
          columns={columns}
          data={assignmentList}
          sortBy={sortFilter.sortBy as keyof Assignment}
          orderBy={sortFilter.sortDir as keyof Assignment}
          onSort={handleSort}
          onRowClick={handleOnRowClick}
          isDataLoading={isLoading}
        />
        <div className="flex justify-end w-full m-auto mt-[20px]">
          <PageSizeSelect value={pageSize} setValue={setPageSize} />
          <Pagination
            currentPage={pagingData?.currentPage}
            totalPages={pagingData?.totalPage}
            onPageChange={(page) => setPagingData({ ...pagingData, currentPage: page })}
          />
        </div>
      </ContentWrapper>
      {
        isDetailAssignmentLoading ? <BigLoading /> :
          viewDetailModal &&
          (
            <DetailAssignmentModal
              closeModal={() => setViewDetailModal(false)}
              data={{
                ...detailAssignmentData,
              }}
            />
          )}
      {viewDeleteModal && (
        <DeleteAssignmentModal
          closeModal={() => setViewDeleteModal(false)}
          id={editAssignmentId}
          isDeletable={isAssignementDeletetable}
          setAssignmentList={(id) =>
            setAssignementList([...assignmentList.filter((item) => item.id !== id)])
          }
        />
      )}

      {/* showReturnModal */}
      {showReturnModal && (
        <ReturnAdminAssignmentModal
          assignmentId={editAssignmentId}
          showModal={showReturnModal}
          onSuccess={() => {
            setShowReturnModal(false);
            fetchAssignmentList();
          }}
          closeModal={() => setShowReturnModal(false)}
        />
      )}
    </>
  );
};

export default ManageAssignment;
