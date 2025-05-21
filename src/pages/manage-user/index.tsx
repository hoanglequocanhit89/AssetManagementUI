import { useEffect, useState } from "react";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper"
import SearchInput from "../../components/ui/search";
import SelectFilter from "../../components/ui/select-filter";
import { BaseResponse, User } from "../../types";
import Table, { Column } from "../../components/ui/table";
import DetailUser from "./detail-user";
import DisableUser from "./disable-user";
import Pagination from "../../components/ui/pagination";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import userApi from "../../api/userApi";
import { useDebounce } from "../../hooks/useDebounce";

const getColumns = (handlers: {
    onEdit: (row: User) => void;
    onDelete: (row: User) => void;
}): Column<User>[] => [
        { key: 'staffCode', title: 'Staff Code' },
        { key: 'fullName', title: 'Full Name' },
        { key: 'username', title: 'Username' },
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

const options = [
    { value: '', label: 'All' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'STAFF', label: 'Staff' },
];

const ManageUser = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [userData, setUserData] = useState<BaseResponse<User>>();
    const [userId, setUserId] = useState<number>(0);

    const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") || "");
    const [textSearch, setTextSearch] = useState<string>("");
    const debouncedKeyword = useDebounce(textSearch, 500);

    const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "firstName");
    const [orderBy, setOrderBy] = useState<string>(searchParams.get("orderBy") || "asc");
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);

    const [showModal, setShowModal] = useState(false);
    const [showDisableModal, setShowDisableModal] = useState(false);

    const handleSearch = (value: string) => {
        setTextSearch(value)
        setCurrentPage(1)
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleClickRow = (id: number) => {
        setShowModal(true)
        setUserId(id)
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

    const fetchAllUserList = async () => {
        const tempUser = location.state?.tempUser;
        const response = await userApi.getUserList(1, {
            query: debouncedKeyword,
            type: selectedType
        }, {
            page: currentPage - 1,
            size: tempUser ? 19 : 20,
            sortBy: sortBy,
            sortDir: orderBy
        });

        let users = response.data.content;

        if (tempUser) {
            users = users.filter(u => u.id !== tempUser.id);
            users.unshift(tempUser);
        }

        setUserData({ ...response, data: { ...response.data, content: users } });
    };

    useEffect(() => {
        fetchAllUserList()
    }, [selectedType, sortBy, orderBy, currentPage, debouncedKeyword])

    useEffect(() => {
        setSearchParams({
            keyword: debouncedKeyword,
            type: selectedType,
            page: currentPage.toString(),
            sortBy,
            orderBy
        })
    }, [debouncedKeyword, selectedType, sortBy, orderBy, currentPage, setSearchParams])

    return (
        <>
            <ContentWrapper title={'User List'}>

                <div className="flex justify-between items-center w-full mb-[20px]">
                    <div className="min-w-[220px]">
                        <SelectFilter
                            label="Type"
                            options={options}
                            selected={selectedType}
                            onSelect={(value) => {
                                setSelectedType(value)
                            }}
                        />
                    </div>
                    <div className="flex flex items-center gap-4 flex-shrink-0">
                        <SearchInput onSearch={handleSearch} />
                        <Button text="Create new user" color="primary" onClick={() => navigate("create")} />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={userData?.data.content ?? []}
                    onSort={(key, direction) => {
                        if (key === "fullName") {
                            setSortBy("firstName")
                        } else {
                            setSortBy(key)
                        }
                        setOrderBy(direction)
                    }}
                    onRowClick={(id) => handleClickRow(id)}
                />

                <div className="flex justify-end w-full m-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={userData?.data.totalPages ?? 0}
                        onPageChange={handlePageChange}
                        maxVisiblePages={3}
                    />
                </div>

            </ContentWrapper>

            {showModal &&
                <DetailUser
                    showModal={showModal}
                    closeModal={() => setShowModal(false)}
                    userId={userId}
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