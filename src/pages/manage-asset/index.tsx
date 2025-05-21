import ContentWrapper from "../../components/ui/content-wrapper";
import Table, { Column } from "../../components/ui/table";
import React from "react";
import FormModal from "../../components/ui/form-modal";
import DetailAssetModal from "./components/detail-asset";
import SelectFilter from "../../components/ui/select-filter";
import SearchInput from "../../components/ui/search";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import { useNavigate } from "react-router-dom";

interface Asset {
    id: number,
    assetCode: string,
    assetName: string,
    category: string,
    state: string;
};

const assetList: Asset[] = [
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 2,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Assigned"
    },
    {
        id: 3,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    },
    {
        id: 1,
        assetCode: "LA100001",
        assetName: "Laptop HP Probook 450 G1",
        category: "Laptop",
        state: "Available"
    }
];

const getColumns = (handlers: {
    onEdit: (row: Asset) => void;
    onDelete: (row: Asset) => void;
}): Column<Asset>[] => [
    { key: 'assetCode', title: 'Asset Code' },
    { key: 'assetName', title: 'Asset Code' },
    { key: 'category', title: 'Category' },
    { key: 'state', title: 'State' },
    { key: 'action', actions: [
        { 
            render: (row) => (
                <button disabled={row.state === 'Assigned'}>
                    <i className={`fa-solid fa-pen ${row.state === 'Assigned' ? 'opacity-50 cursor-default' : ''}`}></i>
                </button>
                ),
            onClick: handlers.onEdit,
        },
        { 
            render: (row) => (
                <button disabled={row.state === 'Assigned'}>
                    <i className={`fa-regular fa-circle-xmark ${row.state === 'Assigned' ? 'opacity-50 cursor-default' : ''}`}></i>
                </button>
                ), 
            onClick: handlers.onDelete,
        }
    ]},
];

const stateArr = [
    {
        value: 'available',
        label: 'Available'
    },
    {
        value: 'not-available',
        label: 'Not available'
    },
    {
        value: 'assigned',
        label: 'Assigned'
    },
];

const categoryArr = [
    {
        value: 'laptop',
        label: 'Laptop'
    },
    {
        value: 'monitor',
        label: 'Monitor'
    },
    {
        value: 'personal-computer',
        label: 'Personal Computer'
    },
];

const pagingArr = {
    currentPage: 1,
    totalPage: 3
}

const ManageAsset = () => {
    
    const [viewDetailModal, setViewDetailModal] = React.useState<boolean>(false);
    const [viewDeleteModal, setViewDeleteModal] = React.useState<boolean>(false);
    const [stateFilter, setStateFilter] = React.useState<string>('');
    const [categoryFilter, setCategoryFilter] = React.useState<string>('');
    const [currentPage, setCurrentPage] = React.useState<number>(pagingArr.currentPage);
    const navigate = useNavigate();
    const [searchFilter, setSearchFilter] = React.useState<string>('');

    const handleOnRowClick = (id: number) => {
        setViewDetailModal(true);
        console.log(id);
    };

    const handleEdit = (row: Asset) => {
        navigate(`edit/${row.id}`)
    };

    const handleDelete = () => {
        setViewDeleteModal(true);
        console.log("click delete");
    }

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete 
    })

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
                        options={categoryArr} 
                        onSelect={(value) => setCategoryFilter(value)}
                        selected={categoryFilter}
                    />
                    <SearchInput onSearch={(data) => console.log(data)} />
                    <Button text="Create new asset" color="primary" onClick={() => navigate("create")} />
                </div>
                <Table 
                    columns={columns} 
                    data={assetList}
                    onSort={(key, direction) => console.log(key, direction)}
                    onRowClick={(id) => handleOnRowClick(id)}
                />
                <div className="self-end mt-[20px]">
                    <Pagination currentPage={currentPage} totalPages={pagingArr.totalPage} onPageChange={(page) => setCurrentPage(page)} />
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
                                date: 'a',
                                assignedTo: 'a',
                                assignedBy: 'a',
                                returnedDate: 'a'
                            }
                        ]
                    }}
                />
            }
        </>
    )
};

export default ManageAsset;