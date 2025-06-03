import { Navigate, data, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

const getColumns = (props: {
  handlers: {
    onEdit: (row: Assignment) => void;
    onDelete: (row: Assignment) => void;
  };
  pagingData: PagingProps;
}): Column<Assignment>[] => {
  const { handlers, pagingData } = props;
  return [
    {
      key: "id",
      title: "No.",
      render: (_value, _row, index: number) => (pagingData.currentPage - 1) * 20 + index + 1,
    },
    { key: "assetCode", title: "Asset Code" },
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
      actions: [
        {
          render: (row) => {
            const isDisabled = row.status === "ACCEPTED" || row.status === "DECLINED";
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
            const isDisabled = row.status === "ACCEPTED";
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
          render: (row) => (
            <button>
              <i className="fa-solid fa-rotate-left" title="Return"></i>
            </button>
          ),
          onClick: () => { }
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
  const [searchParams, setSearchParams] = useSearchParams();
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
        size: 20,
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
    fetchAssignmentList();
  }, [
    stateFilter,
    debouncedKeyword,
    sortFilter.sortBy,
    sortFilter.sortDir,
    pagingData.currentPage,
    assignedDateFilter,
  ]);

  const handleEdit = (row: Assignment) => {
    navigate(`edit/${row.id}`);
  };

  const handleDelete = async (row: Assignment) => {
    setEditAssignmentId(row.id);
    setIsAssetDeletetable(row.canDelete);
    setViewDeleteModal(true);
  };

  const columns = getColumns({
    handlers: {
      onEdit: handleEdit,
      onDelete: handleDelete,
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
      const response = await assignmentApi.getAssignmentDetail(id);
      setDetailAssignmentData({ ...response.data });
    } catch (error) {
      console.log(error);
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
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [viewDetailModal, viewDeleteModal]);

  return (
    <>
      <ContentWrapper title={"Assignment List"}>
        <div className="d-flex gap-[20px] mb-[20px]">
          <SelectFilter
            label="State"
            options={stateArr}
            onSelect={(value) => setStateFilter(value)}
            selected={stateFilter}
          />
          <DateFilter
            label="Assigned Date"
            selectedDate={assignedDateFilter}
            onSelect={(date) => setAssignedDateFilter(date)}
            isHighlight={!!assignedDateFilter}
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
        <div className="self-end mt-[20px]">
          <Pagination
            currentPage={pagingData?.currentPage}
            totalPages={pagingData?.totalPage}
            onPageChange={(page) => setPagingData({ ...pagingData, currentPage: page })}
          />
        </div>
      </ContentWrapper>
      {viewDetailModal && (
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
    </>
  );
};

export default ManageAssignment;
