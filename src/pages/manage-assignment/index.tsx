import { Navigate, data, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper"
import DateFilter from "../../components/ui/date-filter";
import SearchInput from "../../components/ui/search";
import SelectFilter from "../../components/ui/select-filter";
import Table, { Column } from "../../components/ui/table";
import React, { useEffect } from "react";
import assignmentApi from "../../api/assignmentApi";
import Pagination from "../../components/ui/pagination";
import { Assignment, AssignmentDetail } from "../../types/assignment";
import DetailAssignmentModal from "./components/detail-assignment";
import DeleteAssignmentModal from "./components/delete-assignment";
import { useDebounce } from "../../hooks/useDebounce";

const getColumns = (handlers: {
    onEdit: (row: Assignment) => void;
    onDelete: (row: Assignment) => void;
}): Column<Assignment>[] => [
        { key: 'id', title: 'No.' },
        { key: 'assetCode', title: 'Asset Code' },
        { key: 'assetName', title: 'Asset Name' },
        { key: 'assignedTo', title: 'Assigned to' },
        { key: 'assignedBy', title: 'Assigned Date' },
        { key: 'status', title: 'State' },
        {
            key: 'action', actions: [
                {
                    render: (row) => (
                        <button disabled={row.status === 'ACCEPTED'}>
                            <i className={`fa-solid fa-pen ${row.status === 'ASSIGNED' ? 'opacity-50 cursor-default' : ''}`}></i>
                        </button>
                    ), onClick: handlers.onEdit,
                },
                {
                    render: (row) => (
                        <button disabled={row.status === 'DECLINED'}>
                            <i className={`fa-regular fa-circle-xmark text-[var(--primary-color)] ${row.status === 'ASSIGNED' ? 'opacity-50 cursor-default' : ''}`}></i>
                        </button>
                    ), onClick: handlers.onDelete,
                },
                {
                    render: (row) => (
                        <button>
                            <i className="fa-solid fa-rotate-left"></i>
                        </button>
                    ), onClick: handlers.onDelete,
                }
            ]
        }
    ]

const stateArr = [
    {
        value: 'ACCEPTED',
        label: 'Accepted'
    },
    {
        value: 'WAITING_FOR_ACCEPTANCE',
        label: 'Waiting for acceptance'
    },
    {
        value: 'DECLINED',
        label: 'Declined'
    },
    {
        value: '',
        label: 'State'
    }
];

interface SortFilterProps {
    sortBy: string,
    sortDir: string
}

interface PagingProps {
    currentPage: number;
    totalPage: number;
}

const ManageAssignment = () => {
    const location = useLocation();
    const [editAssignmentId, setEditAssignmentId] = React.useState<number>(0);
    const [isAssignementDeletetable, setIsAssetDeletetable] = React.useState<boolean>(false);
    const [viewDetailModal, setViewDetailModal] = React.useState<boolean>(false);
    const [viewDeleteModal, setViewDeleteModal] = React.useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [stateFilter, setStateFilter] = React.useState<string>(searchParams.get('states') || '');
    const [searchFilter, setSearchFilter] = React.useState<string>(searchParams.get('keyword') || '');
    const [assignmentList, setAssignementList] = React.useState<Assignment[]>([]);
    const [sortFilter, setSortFilter] = React.useState<SortFilterProps>({ sortBy: searchParams.get('sortBy') || '', sortDir: searchParams.get('sortDir') || '' });
    const [pagingData, setPagingData] = React.useState<PagingProps>({ currentPage: Number(searchParams.get('page')) || 1, totalPage: 0 });
    const [detailAssignmentData, setDetailAssignmentData] = React.useState<AssignmentDetail>({
        id: 0,
        assetCode: '',
        assetName: '',
        assignedTo: '',
        assignedBy: '',
        assignedDate: '',
        status: '',
        specification: '',
        note: '',
        canDelete: false
    })

    const debouncedKeyword = useDebounce(searchFilter, 500);
    const navigate = useNavigate();
    const IS_TEST_MODE = true;

    const fetchAssignmentList = async () => {
        if (IS_TEST_MODE) {
            const dummyAssignments: Assignment[] = [
                {
                    id: 1,
                    assetCode: 'AC001',
                    assetName: 'Laptop Dell XPS',
                    assignedTo: 'John Doe',
                    assignedBy: 'Admin User',
                    assignedDate: '2025-05-20',
                    status: 'ACCEPTED',
                    canDelete: false
                },
                {
                    id: 2,
                    assetCode: 'AC002',
                    assetName: 'Monitor LG UltraFine',
                    assignedTo: 'Jane Smith',
                    assignedBy: 'Admin User',
                    assignedDate: '2025-05-22',
                    status: 'WAITING_FOR_ACCEPTANCE',
                    canDelete: true
                },
                {
                    id: 3,
                    assetCode: 'AC003',
                    assetName: 'Mouse Logitech MX',
                    assignedTo: 'Michael Johnson',
                    assignedBy: 'Admin User',
                    assignedDate: '2025-05-25',
                    status: 'DECLINED',
                    canDelete: false
                },
            ];

            if (sortFilter.sortBy && sortFilter.sortDir) {
                dummyAssignments.sort((a, b) => {
                    const valA = (a as any)[sortFilter.sortBy];
                    const valB = (b as any)[sortFilter.sortBy];

                    if (valA < valB) return sortFilter.sortDir === 'asc' ? -1 : 1;
                    if (valA > valB) return sortFilter.sortDir === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            setAssignementList(dummyAssignments);
            setPagingData({ currentPage: 1, totalPage: 1 });
            return;
        }

        try {
            const response = await assignmentApi.getAssignmentList({
                locationId: 1,
                keyword: searchFilter,
                states: stateFilter,
                params: {
                    page: pagingData.currentPage - 1,
                    size: 20,
                    sortBy: sortFilter.sortBy,
                    sortDir: sortFilter.sortDir
                }
            });
            if (response.data) {
                setAssignementList(response.data.content);
                setPagingData({
                    ...pagingData,
                    totalPage: response.data.totalPages
                });
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        setSearchFilter(searchParams.get('states') || '');
        setPagingData({ currentPage: Number(searchParams.get('page')) || 1, totalPage: 0 });
        setSearchFilter(searchParams.get('keyword') || '');
        setSortFilter({ sortBy: searchParams.get('sortBy') || '', sortDir: searchParams.get('sortDir') || '' });
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedKeyword) params.set("keyword", debouncedKeyword);
        params.set("states", stateFilter);
        params.set("page", pagingData.currentPage.toString());
        params.set("sortBy", sortFilter.sortBy);
        params.set("sortDir", sortFilter.sortDir);
        const newSearch = params.toString();

        if (location.search !== `?${newSearch}`) {
            navigate({
                pathname: location.pathname,
                search: newSearch
            }, { replace: false });
        }

        fetchAssignmentList();
    }, [stateFilter, debouncedKeyword, sortFilter.sortBy, sortFilter.sortDir, pagingData.currentPage]);

    const handleEdit = (row: Assignment) => {
        navigate(`edit/${row.id}`);
    };

    const handleDelete = async (row: Assignment) => {
        setEditAssignmentId(row.id);
        setIsAssetDeletetable(row.canDelete);
        setViewDeleteModal(true);
    }

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete
    });

    const handleSort = (key: string, direction: string) => {
        setSortFilter({ ...sortFilter, sortBy: key, sortDir: direction })
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
        const handlePopState = (event: PopStateEvent) => {
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
            <ContentWrapper title={'Assignment List'}>
                <div className="d-flex gap-[20px] mb-[20px]">
                    <SelectFilter
                        label="State"
                        options={stateArr}
                        onSelect={(value) => setStateFilter(value)}
                        selected={stateFilter}
                    />
                    <DateFilter
                        label="Assigned Date"
                        selectedDate={undefined}
                        onSelect={() => { }}
                        isHighlight={false}
                    />
                    <SearchInput value={searchFilter} onSearch={(data) => setSearchFilter(data)} />
                    <Button text="Create new assignment" color="primary" onClick={() => navigate('create')} />
                </div>
                <Table
                    columns={columns}
                    data={assignmentList}
                    sortBy={sortFilter.sortBy as keyof Assignment}
                    orderBy={sortFilter.sortDir as keyof Assignment}
                    onSort={handleSort}
                    onRowClick={handleOnRowClick}
                />
                <div className="self-end mt-[20px]">
                    <Pagination currentPage={pagingData?.currentPage} totalPages={pagingData?.totalPage} onPageChange={(page) => setPagingData({ ...pagingData, currentPage: page })} />
                </div>
            </ContentWrapper>
            {
                viewDetailModal &&
                <DetailAssignmentModal
                    closeModal={() => setViewDetailModal(false)}
                    data={{
                        ...detailAssignmentData,
                    }}
                />
            }
            {
                viewDeleteModal &&
                <DeleteAssignmentModal
                    closeModal={() => setViewDeleteModal(false)}
                    id={editAssignmentId}
                    isDeletable={isAssignementDeletetable}
                    setAssignmentList={(id) => setAssignementList([...assignmentList.filter(item => item.id !== id)])}
                />
            }
        </>
    )
};

export default ManageAssignment;