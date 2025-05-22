import ContentWrapper from "../../components/ui/content-wrapper";
import Table, { Column } from "../../components/ui/table";
import React, { useEffect } from "react";
import DetailAssetModal from "./components/detail-asset";
import SelectFilter from "../../components/ui/select-filter";
import SearchInput from "../../components/ui/search";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteAssetModal from "./components/delete-asset";
import assetApi from "../../api/assetApi";
import { Asset, AssetDetail } from "../../types/asset";
import { useDebounce } from "../../hooks/useDebounce";

const getColumns = (handlers: {
    onEdit: (row: Asset) => void;
    onDelete: (row: Asset) => void;
}): Column<Asset>[] => [
    { key: 'assetCode', title: 'Asset Code' },
    { key: 'name', title: 'Asset Name' },
    { key: 'categoryName', title: 'Category' },
    { key: 'state', title: 'State' },
    { key: 'action', actions: [
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
    ]},
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
    const [viewDetailModal, setViewDetailModal] = React.useState<boolean>(false);
    const [viewDeleteModal, setViewDeleteModal] = React.useState<boolean>(false);
    const [stateFilter, setStateFilter] = React.useState<string>('');
    const [categoryFilter, setCategoryFilter] = React.useState<string>('');
    const [pagingData, setPagingData] = React.useState<PagingProps>({currentPage: 0, totalPage: 0});
    const [searchFilter, setSearchFilter] = React.useState<string>('');
    const [categoryList, setCategoryList] = React.useState<CategoryProps[]>([]);
    const [sortFilter, setSortFilter] = React.useState<SortFilterProps>({ sortBy: '', sortDir: '' });
    const [assetList, setAssetList] = React.useState<Asset[]>([]);
    const [detailAssetData, setDetailAssetData] = React.useState<AssetDetail>();
    const debouncedKeyword = useDebounce(searchFilter, 500);
    const navigate = useNavigate();
    
    const fetchAssetList = async () => {
        try {
            const response = await assetApi.getAssetList({
                locationId: 1,
                categoryName: categoryFilter,
                keyword: searchFilter,
                states: stateFilter,
                params: {
                    page: 0,
                    size: 20,
                    sortBy: sortFilter.sortBy,
                    sortDir: sortFilter.sortDir
                }
            });
            console.log(response);
            
            if(response.data) {
                setAssetList([...response.data.content]);
                setPagingData({
                    ...pagingData, 
                    currentPage: response.data.page, 
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
            response && setCategoryList([...cateArr, {value: '', label: 'All'}]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAssetList();
    }, [stateFilter, categoryFilter, debouncedKeyword, sortFilter.sortBy, sortFilter.sortDir]);
    
    useEffect(() => {
        fetchCategoryList();
    }, []);

    const handleOnRowClick = async (id: number) => {
        console.log(id);
        
        // setViewDetailModal(true);
        try {
            const response = await assetApi.getAssetDetail(id);  
            console.log(response);
                      
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (row: Asset) => {
        navigate(`edit/${row.id}`);
    };

    const handleDelete = () => {
        setViewDeleteModal(true);
        console.log("click delete");
    };

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete 
    });

    const handleSort = (key: string, direction: string) => {
        setSortFilter({ ...sortFilter, sortBy: key, sortDir: direction })
    }

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
                    <SelectFilter 
                        label="Category" 
                        options={categoryList} 
                        onSelect={(value) => setCategoryFilter(value)}
                        selected={categoryFilter}
                    />
                    <SearchInput onSearch={(data) => setSearchFilter(data)} />
                    <Button text="Create new asset" color="primary" onClick={() => navigate("create")} />
                </div>
                <Table 
                    columns={columns} 
                    data={assetList}
                    onSort={handleSort}
                    onRowClick={handleOnRowClick}
                />
                <div className="self-end mt-[20px]">
                    <Pagination currentPage={pagingData?.currentPage} totalPages={pagingData?.totalPage} onPageChange={(page) => pagingData.currentPage = page} />
                </div>
            </ContentWrapper>
            { viewDetailModal && 
                <DetailAssetModal 
                    closeModal={() => setViewDetailModal(false)}
                    data={{
                        assetCode: 'a', 
                        assetName: 'a',
                        category: 'a',
                        installedDate: 'a',
                        state: 'a',
                        location: 'a',
                        specification: 'a',
                        history: [
                            {
                                id: 1,
                                assignedDate: 'a',
                                assignedTo: 'a',
                                assignedBy: 'a',
                                returnedDate: 'a'
                            }
                        ]
                    }}
                />
            }
            {
                viewDeleteModal &&
                <DeleteAssetModal 
                    closeModal={() => setViewDeleteModal(false)}
                    isDeletable= {false}
                />
            }
        </>
    )
};

export default ManageAsset;