import React, { useEffect, useState } from "react";
import ContentWrapper from "../../components/ui/content-wrapper";
import SelectFilter from "../../components/ui/select-filter";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DateFilter from "../../components/ui/date-filter";
import SearchInput from "../../components/ui/search";
import Table, { Column } from "../../components/ui/table";
import { RequestReturning } from "../../types/request-returning";
import { getStatusRequestReturningLabel } from "../../utils/status-label";
import Pagination from "../../components/ui/pagination";
import CompletedRequestReturningModal from "./components/completed-request-returning";
import CancelRequestReturningModal from "./components/cancel-request-returing";
import { useDebounce } from "../../hooks/useDebounce";
import requestReturningApi from "../../api/requestReturningApi";
import PageSizeSelect from "../../components/ui/page-size-select";

const stateArr = [
    {
        value: "WAITING",
        label: "Waiting for returning",
    },
    {
        value: "COMPLETED",
        label: "Completed",
    },
    {
        value: "",
        label: "All",
    },
];

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
            fixed: "left",
            width: 50,
            title: "No.",
            render: (_valued, _row, index: number) => (pagingData.currentPage - 1) * 20 + index + 1,
        },
        { key: "assetCode", title: "Asset Code", fixed: "left", width: 50 },
        { key: "assetName", title: "Asset Name" },
        { key: "requestedBy", title: "Requested By" },
        { key: "assignedDate", title: "Assigned Date" },
        { key: "acceptedBy", title: "Accepted By" },
        { key: "returnedDate", title: "Returned Date" },
        {
            key: "status",
            title: "State",
            render: (value) => {
                return <span>{getStatusRequestReturningLabel(String(value))}</span>;
            },
        },
        {
            key: "action",
            fixed: "right",
            actions: [
                {
                    render: (row) => {
                        const isDisabled = row.status === "COMPLETED";
                        return (
                            <button disabled={isDisabled}>
                                <i id="complete"
                                    className={`fa-solid fa-check text-red-600 text-4xl font-black ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                ></i>
                            </button>
                        );
                    },
                    onClick: handlers.onCompleted,
                },
                {
                    render: (row) => {
                        const isDisabled = row.status === "COMPLETED";
                        return (
                            <button disabled={isDisabled}>
                                <i
                                    id="cancel"
                                    className={`fa-solid fa-xmark text-black-600 text-4xl font-black ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                ></i>
                            </button>
                        );
                    },
                    onClick: handlers.onCancel,
                },
            ],
        },
    ];
};

interface PagingProps {
    currentPage: number;
    totalPage: number;
}

interface SortFilterProps {
    sortBy: string;
    sortDir: string;
}
const RequestForReturn = () => {
    const [searchParams] = useSearchParams();
    const [stateFilter, setStateFilter] = React.useState<string>(searchParams.get("states") || "");
    const [returnedDateFilter, setReturnedDateFilter] = React.useState<Date | undefined>(undefined);
    const [searchFilter, setSearchFilter] = React.useState<string>(searchParams.get("keyword") || "");
    const [completedRequestReturningId, setCompletedRequestReturningId] = React.useState<number>(0);
    const [viewCompletedModal, setViewCompletedModal] = React.useState<boolean>(false);
    const [cancelRequestReturningId, setCancelRequestReturningId] = React.useState<number>(0);
    const [viewCancelModal, setViewCancelModal] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pagingData, setPagingData] = React.useState<PagingProps>({
        currentPage: Number(searchParams.get("page")) || 1,
        totalPage: 0,
    });
    const [requestReturningList, setRequestReturningList] = React.useState<RequestReturning[]>([]);
    const [sortFilter, setSortFilter] = React.useState<SortFilterProps>({
        sortBy: searchParams.get("sortBy") || "assetCode",
        sortDir: searchParams.get("sortDir") || "asc",
    });
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(Number(searchParams.get("size")) || 20);
    const debouncedKeyword = useDebounce(searchFilter, 500);
    const location = useLocation();
    const navigate = useNavigate();

    const handleCompleted = async (row: RequestReturning) => {
        setCompletedRequestReturningId(row.id);
        setViewCompletedModal(true);
    };

    const handleCancel = async (row: RequestReturning) => {
        setCancelRequestReturningId(row.id);
        setViewCancelModal(true);
    };

    const colums = getColumns({
        handlers: {
            onCompleted: handleCompleted,
            onCancel: handleCancel,
        },
        pagingData: pagingData,
    });

    const handleSort = (key: string, direction: string) => {
        setSortFilter({ ...sortFilter, sortBy: key, sortDir: direction });
    };

    const fetchRequestReturningList = async () => {
        const formatDateToLocalString = (date: Date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        try {
            const tempRequestReturning = location.state?.tempRequestReturning;
            const response = await requestReturningApi.getRequestReturningList({
                status: stateFilter || undefined,
                returnedDate: returnedDateFilter ? formatDateToLocalString(returnedDateFilter) : undefined,
                query: searchFilter || undefined,
                page: pagingData.currentPage - 1,
                size: pageSize,
                sortBy: sortFilter.sortBy || "assetCode",
                sortDir: sortFilter.sortDir || "asc",
            });

            let filteredContent = response.data.content.filter((item) => item.status !== "CANCELLED");

            if (tempRequestReturning) {
                filteredContent = filteredContent.filter((a) => a.id !== tempRequestReturning.id);
                filteredContent.unshift(tempRequestReturning);
            }

            if (response.data) {
                if (tempRequestReturning) {
                    response.data.content = response.data.content.filter(
                        (a) => a.id !== tempRequestReturning.id
                    );
                    response.data.content.unshift(tempRequestReturning);
                    setRequestReturningList(response.data.content);
                    setTotalElements(response.data.totalElements);
                } else {
                    setRequestReturningList(response.data.content);
                    setTotalElements(response.data.totalElements);
                }
                setPagingData((prev) => ({
                    ...prev,
                    totalPage: response.data.totalPages,
                }));
                setIsLoading(false);
                setRequestReturningList(filteredContent);
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
        requestReturningList.length = 0;
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
            return `${year}-${month}-${day}`;
        };

        if (returnedDateFilter) {
            params.set("returnedDate", formatDateToLocalString(returnedDateFilter));
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
        fetchRequestReturningList();
    }, [
        stateFilter,
        debouncedKeyword,
        sortFilter.sortBy,
        sortFilter.sortDir,
        pagingData.currentPage,
        returnedDateFilter,
        pageSize,
    ]);

    useEffect(() => {
        const handlePopState = () => {
            if (viewCompletedModal) {
                setViewCompletedModal(false);
            }
            if (viewCancelModal) {
                setViewCancelModal(false);
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [viewCompletedModal, viewCancelModal]);

    return (
        <>
            <ContentWrapper title={"Request List"}>
                <div className="d-flex gap-[20px] mb-[20px] z-20">
                    <SelectFilter
                        placeholder="State"
                        options={stateArr}
                        onSelect={(value) => setStateFilter(value)}
                        selected={stateFilter}
                    />
                    <DateFilter
                        id="returnedDate"
                        label="Returned Date"
                        selectedDate={returnedDateFilter}
                        onSelect={(date) => setReturnedDateFilter(date)}
                        isHighlight={false}
                    />
                    <SearchInput value={searchFilter} onSearch={(data) => setSearchFilter(data)} />
                </div>
                <Table
                    columns={colums}
                    data={requestReturningList}
                    sortBy={sortFilter.sortBy as keyof RequestReturning}
                    orderBy={sortFilter.sortDir as keyof RequestReturning}
                    onSort={handleSort}
                    isDataLoading={isLoading}
                />
                {/* pagination */}
                <div className="flex justify-between items-center w-full m-auto mt-[20px]">
                    <span className="text-2xl text-gray-500 font-semibold w-1/4">
                        {totalElements ?? 0} {totalElements === 1 ? "result" : "results"} found
                    </span>
                    <div className="flex justify-end w-full">
                        <PageSizeSelect value={pageSize} setValue={setPageSize} onChange={() => {
                            setPagingData({ ...pagingData, currentPage: 1 })
                        }} />
                        <Pagination
                            currentPage={pagingData?.currentPage}
                            totalPages={pagingData?.totalPage ?? 0}
                            onPageChange={(page) => setPagingData({ ...pagingData, currentPage: page })}
                        />
                    </div>
                </div>
            </ContentWrapper>
            {viewCompletedModal && (
                <CompletedRequestReturningModal
                    closeModal={() => setViewCompletedModal(false)}
                    id={completedRequestReturningId}
                    setRequestReturningList={(id) =>
                        setRequestReturningList((prev) =>
                            prev.map((item) => (item.id === id ? { ...item, status: "COMPLETED" } : item))
                        )
                    }
                />
            )}
            {viewCancelModal && (
                <CancelRequestReturningModal
                    closeModal={() => setViewCancelModal(false)}
                    id={cancelRequestReturningId}
                    setRequestReturningList={(id) =>
                        setRequestReturningList([...requestReturningList.filter((item) => item.id !== id)])
                    }
                />
            )}
        </>
    );
};

export default RequestForReturn;
