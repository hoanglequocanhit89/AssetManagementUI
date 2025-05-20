import ContentWrapper from "../../components/ui/content-wrapper";
import Table, { Column } from "../../components/ui/table";
import React from "react";
import FormModal from "../../components/ui/form-modal";
import DetailAssetModal from "./components/detail-asset";
import SelectFilter from "../../components/ui/select-filter";
import SearchInput from "../../components/ui/search";
import Button from "../../components/ui/button";

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

const columns: Column<Asset>[] = [
    { key: 'assetCode', title: 'Asset Code' },
    { key: 'assetName', title: 'Asset Code' },
    { key: 'category', title: 'Category' },
    { key: 'state', title: 'State' },
    { key: 'action', actions: [
        { 
            render: (row) => (<i className="fa-solid fa-pen"></i>), 
            onClick: (row) => console.log("update", row),
        },
        { 
            render: (row) => (<i className="fa-regular fa-circle-xmark"></i>), 
            onClick: (row) => console.log("Delete", row),
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

const ManageAsset = () => {
    
    const [editModal, setEditModal] = React.useState<boolean>(false);
    const [stateFilter, setStateFilter] = React.useState<string>('');
    const [categoryFilter, setCategoryFilter] = React.useState<string>('');

    const handleOnRowClick = (id: number) => {
        setEditModal(true);
        console.log(id);
    };

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
                    <Button text="Create new asset" type="primary" onClick={() => console.log("createnew")} />
                </div>
                <Table 
                    columns={columns} 
                    data={assetList}
                    onSort={(key, direction) => console.log(key, direction)}
                    onRowClick={(id) => handleOnRowClick(id)}
                />
                <h1 className="text-right py-[30px]">Paging component</h1>
            </ContentWrapper>
            { editModal && 
                <DetailAssetModal 
                    closeModal={() => setEditModal(false)}
                    
                />
            }
        </>
    )
};

export default ManageAsset;