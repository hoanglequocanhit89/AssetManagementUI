import React from "react";
import ContentWrapper from "../../components/ui/content-wrapper"
import SelectFilter from "../../components/ui/select-filter";
import { data, useSearchParams } from "react-router-dom";
import DateFilter from "../../components/ui/date-filter";
import SearchInput from "../../components/ui/search";
import Table, { Column } from "../../components/ui/table";
import { RequestReturning } from "../../types/request-returning";
import { getStatusLabel, getStatusRequestReturningLabel } from "../../utils/status-label";
import Pagination from "../../components/ui/pagination";
import CompletedRequestReturningModal from "./components/completed-request-returning";
import CancelRequestReturningModal from "./components/cancel-request-returing";

const stateArr = [
    {
        value: "WAITING",
        label: "Waiting for returning"
    },
    {
        value: "COMPLETED",
        label: "Completed"
    }
]

const getColumns = (props: {
    handlers: {
        onCompleted: (row: RequestReturning) => void;
        onCancel: (row: RequestReturning) => void;
    };
    pagingData: PagingProps;
}): Column<RequestReturning>[] => {
    const { handlers, pagingData } = props;
    return [
        {
            key: "id",
            title: "No.",
            render: (_valued, _row, index: number) => (pagingData.currentPage - 1) * 20 + index + 1,
        },
        { key: "assetCode", title: "Asset Code" },
        { key: "assetName", title: "Asset Name" },
        { key: "requestedBy", title: "Requested By" },
        { key: "assignedDate", title: "Assigned Date" },
        { key: "acceptedBy", title: "Accepted By" },
        { key: "returnedDate", title: "Returned Date" },
        {
            key: "status",
            title: "State",
            render: (value) => {
                return <span>{getStatusRequestReturningLabel(String(value))}</span>
            }
        },
        {
            key: "action",
            actions: [
                {
                    render: (row) => {
                        const isDisabled = row.status === "COMPLETED";
                        return (
                            <button disabled={isDisabled}>
                                <i className={`fa-solid fa-check text-red-600 text-4xl font-black ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>

                                </i>
                            </button>
                        );
                    },
                    onClick: handlers.onCompleted
                },
                {
                    render: (row) => {
                        const isDisabled = row.status === "COMPLETED";
                        return (
                            <button disabled={isDisabled}>
                                <i className={`fa-solid fa-xmark text-black-600 text-4xl font-black ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                                </i>
                            </button>
                        );
                    },
                    onClick: handlers.onCancel,
                },
            ]
        }
    ]
}

interface PagingProps {
    currentPage: number;
    totalPage: number;
}

interface SortFilterProps {
    sortBy: string;
    sortDir: string;
}
const RequestForReturn = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [stateFilter, setStateFilter] = React.useState<string>(searchParams.get("states") || "");
    const [assignedDateFilter, setAssignedDateFilter] = React.useState<Date | undefined>(undefined);
    const [searchFilter, setSearchFilter] = React.useState<string>(searchParams.get("keyword") || "");
    const [completedRequestReturningId, setCompletedRequestReturningId] = React.useState<number>(0);
    const [viewCompletedModal, setViewCompletedModal] = React.useState<boolean>(false);
    const [cancelRequestReturningId, setCancelRequestReturningId] = React.useState<number>(0);
    const [viewCancelModal, setViewCancelModal] = React.useState<boolean>(false);
    const [pagingData, setPagingData] = React.useState<PagingProps>({
        currentPage: Number(searchParams.get("page")) || 1,
        totalPage: 0,
    });
    const [RequestReturningList, setRequestReturningList] = React.useState<RequestReturning[]>([]);
    const [sortFilter, setSortFilter] = React.useState<SortFilterProps>({
        sortBy: searchParams.get("sortBy") || "assetCode",
        sortDir: searchParams.get("sortDir") || "asc",
    });

    const handleCompleted = async (row: RequestReturning) => {
        setCompletedRequestReturningId(row.id);
        setViewCompletedModal(true);
    }

    const handleCancel = async (row: RequestReturning) => {
        setCancelRequestReturningId(row.id);
        setViewCancelModal(true);
    }

    const colums = getColumns({
        handlers: {
            onCompleted: handleCompleted,
            onCancel: handleCancel
        },
        pagingData: pagingData,
    });

    const handleSort = (key: string, direction: string) => {
        setSortFilter({ ...sortFilter, sortBy: key, sortDir: direction });
    };

    React.useEffect(() => {
        const mockData: RequestReturning[] = [
            {
                id: 1,
                assetCode: "AC001",
                assetName: "Laptop Dell",
                requestedBy: "John Doe",
                assignedDate: "2024-05-01",
                acceptedBy: "Jane Smith",
                returnedDate: "2024-05-10",
                status: "WAITING"
            },
            {
                id: 2,
                assetCode: "AC002",
                assetName: "Monitor Samsung",
                requestedBy: "Alice Johnson",
                assignedDate: "2024-05-03",
                acceptedBy: "Bob Brown",
                returnedDate: "2024-05-12",
                status: "COMPLETED"
            },
        ];

        setRequestReturningList(mockData);
        setPagingData(prev => ({
            ...prev,
            totalPage: 1
        }));
    }, []);

    return (
        <>
            <ContentWrapper title={'Request List'}>
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
                </div>
                <Table
                    columns={colums}
                    data={RequestReturningList}
                    sortBy={sortFilter.sortBy as keyof RequestReturning}
                    orderBy={sortFilter.sortDir as keyof RequestReturning}
                    onSort={handleSort}
                />
                <div className="self-end mt-[20px]">
                    <Pagination
                        currentPage={pagingData?.currentPage}
                        totalPages={pagingData?.totalPage}
                        onPageChange={(page) => setPagingData({ ...pagingData, currentPage: page })}
                    />
                </div>
            </ContentWrapper>
            {
                viewCompletedModal && (
                    <CompletedRequestReturningModal
                        closeModal={() => setViewCompletedModal(false)}
                        id={cancelRequestReturningId}
                        setRequestReturningList={(id) => setRequestReturningList([...RequestReturningList.filter((item) => item.id !== id)])
                        }
                    />
                )
            }
            {
                viewCancelModal && (
                    <CancelRequestReturningModal
                        closeModal={() => setViewCancelModal(false)}
                        id={cancelRequestReturningId}
                        setRequestReturningList={(id) =>
                            setRequestReturningList([...RequestReturningList.filter((item) => item.id !== id)])}
                    />
                )
            }
        </>
    )
};

export default RequestForReturn;