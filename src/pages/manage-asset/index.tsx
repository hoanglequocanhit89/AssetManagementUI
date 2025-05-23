import ContentWrapper from "../../components/ui/content-wrapper";
import Table, { Column } from "../../components/ui/table";
import React, { useEffect } from "react";
import DetailAssetModal from "./components/detail-asset";
import SelectFilter from "../../components/ui/select-filter";
import SearchInput from "../../components/ui/search";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DeleteAssetModal from "./components/delete-asset";
import assetApi from "../../api/assetApi";
import { Asset, AssetDetail } from "../../types/asset";
import { useDebounce } from "../../hooks/useDebounce";
import SearchSelect from "../../components/ui/search-select";

const getColumns = (handlers: {
    onEdit: (row: Asset) => void;
    onDelete: (row: Asset) => void;
}): Column<Asset>[] => [
        { key: 'assetCode', title: 'Asset Code' },
        { key: 'name', title: 'Asset Name' },
        { key: 'categoryName', title: 'Category' },
        { key: 'state', title: 'State' },
        {
            key: 'action', actions: [
                {
                    render: (row) => (
                        <button disabled={row.state === 'ASSIGNED'}>
                            <i className={`fa-solid fa-pen ${row.state === 'ASSIGNED' ? 'opacity-50 cursor-default' : ''}`}></i>
                        </button>
                    ),
                    onClick: handlers.onEdit,
                },
                {
                    render: (row) => (
                        <button disabled={row.state === 'ASSIGNED'}>
                            <i className={`fa-regular fa-circle-xmark text-[var(--primary-color)] ${row.state === 'ASSIGNED' ? 'opacity-50 cursor-default' : ''}`}></i>
                        </button>
                    ),
                    onClick: handlers.onDelete,
                }
            ]
        },
    ];

const stateArr = [
    {
        value: 'AVAILABLE',
        label: 'Available'
    },
    {
        value: 'NOT_AVAILABLE',
        label: 'Not available'
    },
    {
        value: 'ASSIGNED',
        label: 'Assigned'
    },
    {
        value: '',
        label: 'All'
    },
];

interface CategoryProps {
    value: string,
    label: string
};

interface PagingProps {
    currentPage: number,
    totalPage: number
};

interface SortFilterProps {
    sortBy: string,
    sortDir: string
}

const ManageAsset = () => {

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewDetailModal, setViewDetailModal] = React.useState<boolean>(false);
    const [viewDeleteModal, setViewDeleteModal] = React.useState<boolean>(false);
    const [editAssetId, setEditAssetId] = React.useState<number>(0);
    const [isAssetDeletable, setIsAssetDeletable] = React.useState<boolean>(false);
    const [stateFilter, setStateFilter] = React.useState<string>(searchParams.get('states') || '');
    const [categoryFilter, setCategoryFilter] = React.useState<string>(searchParams.get('categoryName') || '');
    const [pagingData, setPagingData] = React.useState<PagingProps>({ currentPage: Number(searchParams.get('page')) || 1, totalPage: 0 });
    const [searchFilter, setSearchFilter] = React.useState<string>(searchParams.get('keyword') || '');
    const [categoryList, setCategoryList] = React.useState<CategoryProps[]>([]);
    const [sortFilter, setSortFilter] = React.useState<SortFilterProps>({ sortBy: searchParams.get('sortBy') || '', sortDir: searchParams.get('sortDir') || '' });
    const [assetList, setAssetList] = React.useState<Asset[]>([]);
    const [detailAssetData, setDetailAssetData] = React.useState<AssetDetail>({
        id: 0,
        canDelete: false,
        assetCode: '',
        assignments: [],
        categoryName: '',
        status: '',
        category: '',
        installedDate: '',
        location: '',
        name: '',
        specification: '',
        state: ''
    });
    const debouncedKeyword = useDebounce(searchFilter, 500);
    const navigate = useNavigate();

    const fetchAssetList = async () => {
        try {
            const tempAsset = location.state?.tempAsset;
            const response = await assetApi.getAssetList({
                locationId: 1,
                categoryName: categoryFilter,
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
                let assets = response.data.content;

                if (tempAsset) {
                    assets = assets.filter(a => a.id !== tempAsset.id);
                    assets.unshift(tempAsset);
                    console.log(assets);
                    setAssetList(assets);
                }
                else {
                    setAssetList([...response.data.content]);
                }

                setPagingData({
                    ...pagingData,
                    totalPage: response.data.totalPages
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategoryList = async () => {
        try {
            const response = await assetApi.getCategoryList();
            const cateArr = [...response.data].map(item => (
                { value: item.name, label: item.name }
            ));
            response && setCategoryList([...cateArr, { value: '', label: 'All' }]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAssetList();
    }, [stateFilter, categoryFilter, debouncedKeyword, sortFilter.sortBy, sortFilter.sortDir, pagingData.currentPage]);

    useEffect(() => {
        fetchCategoryList();
    }, []);

    useEffect(() => {
        setSearchParams({
            states: stateFilter,
            categoryName: categoryFilter,
            keyword: searchFilter,
            page: pagingData.currentPage.toString(),
            sortBy: sortFilter.sortBy,
            sortDir: sortFilter.sortDir
        });
        fetchAssetList();
    }, [stateFilter, categoryFilter, debouncedKeyword, sortFilter.sortBy, sortFilter.sortDir]);

    const handleOnRowClick = async (id: number) => {
        setViewDetailModal(true);
        window.history.pushState({ modal: true }, "");
        try {
            const response = await assetApi.getAssetDetail(id);
            setDetailAssetData({ ...response.data });
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (row: Asset) => {
        navigate(`edit/${row.id}`);
    };

    const handleDelete = (row: Asset) => {
        setEditAssetId(row.id);
        setIsAssetDeletable(row.canDelete);
        setViewDeleteModal(true);
    };

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete
    });

    const handleSort = (key: string, direction: string) => {
        setSortFilter({ ...sortFilter, sortBy: key, sortDir: direction })
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
            <ContentWrapper title={'Asset List'}>
                <div className="d-flex gap-[20px] mb-[20px]">
                    <SelectFilter
                        label="State"
                        options={stateArr}
                        onSelect={(value) => setStateFilter(value)}
                        selected={stateFilter}
                    />

                    <SearchSelect
                        options={categoryList}
                        onSelect={(value) => setCategoryFilter(value)}
                        selected={categoryFilter}
                        placeholder="All"
                    />
                    <SearchInput onSearch={(data) => setSearchFilter(data)} />
                    <Button text="Create new asset" color="primary" onClick={() => navigate("create")} />
                </div>
                <Table
                    columns={columns}
                    data={assetList}
                    sortBy={sortFilter.sortBy as keyof Asset}
                    orderBy={sortFilter.sortDir as keyof Asset}
                    onSort={handleSort}
                    onRowClick={handleOnRowClick}
                />
                <div className="self-end mt-[20px]">
                    <Pagination currentPage={pagingData?.currentPage} totalPages={pagingData?.totalPage} onPageChange={(page) => setPagingData({ ...pagingData, currentPage: page })} />
                </div>
            </ContentWrapper>
            {viewDetailModal &&
                <DetailAssetModal
                    closeModal={() => setViewDetailModal(false)}
                    data={{
                        ...detailAssetData,
                        assignments: detailAssetData?.assignments.map((item, idx) => ({ ...item, id: idx }))
                    }}
                />
            }
            {
                viewDeleteModal &&
                <DeleteAssetModal
                    closeModal={() => setViewDeleteModal(false)}
                    id={editAssetId}
                    isDeletable={isAssetDeletable}
                />
            }
        </>
    )
};

export default ManageAsset;