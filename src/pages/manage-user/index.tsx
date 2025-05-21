import { useEffect, useState } from "react";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper"
import SearchInput from "../../components/ui/search";
import SelectFilter from "../../components/ui/select-filter";
import { User } from "../../types";
import Table, { Column } from "../../components/ui/table";
import DetailUser from "./detail-user";
import DisableUser from "./disable-user";
import Pagination from "../../components/ui/pagination";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";

const data: User[] = [];

const getColumns = (handlers: {
    onEdit: (row: User) => void;
    onDelete: (row: User) => void;
}): Column<User>[] => [
        { key: 'staffCode', title: 'Staff Code' },
        { key: 'fullName', title: 'Staff Name' },
        { key: 'userName', title: 'Username' },
        { key: 'joinedDate', title: 'Joined Date' },
        { key: 'role', title: 'Type' },
        {
            key: 'action',
            actions: [
                {
                    render: (row) => <i className={`fa-solid fa-pen`}></i>,
                    onClick: handlers.onEdit,
                },
                {
                    render: <i className="fa-regular fa-circle-xmark text-[#CF2338]"></i>,
                    onClick: handlers.onDelete,
                },
            ]
        },
    ];

const ManageUser = () => {

    const [selectedState, setSelectedState] = useState<string | undefined>();
    const [showModal, setShowModal] = useState(false);
    const [showDisableModal, setShowDisableModal] = useState(false);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;


    const options = [
        { value: 'all', label: 'All' },
        { value: 'admin', label: 'Admin' },
        { value: 'staff', label: 'Staff' },
    ];

    const handleSearch = (value: string) => {
        console.log("Search for:", value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log(page)
    };

    const handleClickRow = (id: number) => {
        setShowModal(true)
    }

    const handleEdit = (row: User) => {
        navigate(`edit/${row.id}`);
    };

    const handleDisableUser = (row: User) => {
        setShowDisableModal(true)
        console.log("Delete", row);
    };

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDisableUser,
    });

    useEffect(() => {
        const fetchAllUserList = async () => {
            try {
                const response = await userApi.getUserList(3, {
                    query: "sd00",
                    type: "STAFF"
                },
                    {
                        page: 0,
                        size: 20,
                        sortBy: 'firstName',
                        sortDir: 'asc'
                    }
                )
                console.log("response", response)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllUserList()
    }, [])

    return (
        <>
            <ContentWrapper title={'User List'}>

                <div className="flex justify-between items-center w-full mb-[20px]">
                    <div className="min-w-[220px]">
                        <SelectFilter
                            label="Type"
                            options={options}
                            selected={selectedState}
                            onSelect={(value) => {
                                setSelectedState(value);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <SearchInput onSearch={handleSearch} />
                        <Button text="Create new user" type="primary" onClick={() => navigate("create")} />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={data}
                    onSort={(key, direction) => console.log(key, direction)}
                    onRowClick={(id) => handleClickRow(id)}
                />

                <div className="flex justify-end w-full m-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        maxVisiblePages={3}
                    />
                </div>

            </ContentWrapper>

            {showModal &&
                <DetailUser
                    showModal={showModal}
                    closeModal={() => setShowModal(false)}
                />
            }

            {showDisableModal &&
                <DisableUser
                    showModal={showDisableModal}
                    closeModal={() => setShowDisableModal(false)}
                />
            }

        </>
    )
};

export default ManageUser;