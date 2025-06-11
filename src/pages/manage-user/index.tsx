import { useEffect, useState } from "react";
import Button from "../../components/ui/button";
import ContentWrapper from "../../components/ui/content-wrapper";
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
import PageSizeSelect from "../../components/ui/page-size-select";

const getColumns = (handlers: {
    onEdit: (row: User) => void;
    onDelete: (row: User) => void;
}): Column<User>[] => [
        { key: "staffCode", title: "Staff Code" },
        { key: "fullName", title: "Full Name" },
        { key: "username", title: "Username" },
        { key: "joinedDate", title: "Joined Date" },
        {
            key: "role",
            title: "Type",
            render: (value) => {
                const strValue = String(value);
                return (
                    <p>{strValue ? strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase() : ""}</p>
                );
            },
        },
        {
            key: "action",
            actions: [
                {
                    render: (row) => <i id="edit" className={`fa-solid fa-pen`} title="Edit"></i>,
                    onClick: handlers.onEdit,
                },
                {
                    render: (row) => (
                        <i id="disable" className="fa-regular fa-circle-xmark text-[#CF2338]" title="Disable"></i>
                    ),
                    onClick: handlers.onDelete,
                },
            ],
        },
    ];

const options = [
    { value: "", label: "All" },
    { value: "ADMIN", label: "Admin" },
    { value: "STAFF", label: "Staff" },
];

const ManageUser = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<BaseResponse<User>>();
    const [userId, setUserId] = useState<number>(0);

    const [selectedType, setSelectedType] = useState<string>(searchParams.get("type") || "");
    const [textSearch, setTextSearch] = useState<string>(searchParams.get("keyword") || "");
    const debouncedKeyword = useDebounce(textSearch, 500);

    const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "firstName");
    const [sortFieldForApi, setSortFieldForApi] = useState<string>("firstName");
    const [orderBy, setOrderBy] = useState<string>(searchParams.get("orderBy") || "asc");
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
    const [pageSize, setPageSize] = useState<number>(Number(searchParams.get("size")) || 20);

    const [showModal, setShowModal] = useState(false);
    const [showDisableModal, setShowDisableModal] = useState(false);

    const [isDisableUser, setIsDisableUser] = useState<boolean>(false);

    const handleSearch = (value: string) => {
        setTextSearch(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleClickRow = (id: number) => {
        setShowModal(true);
        setUserId(id);
        // Push new state to browser history
        window.history.pushState({ modal: true }, "");
    };

    const handleEdit = (row: User) => {
        navigate(`edit/${row.id}`);
    };

    const handleDisableUser = (row: User) => {
        setIsDisableUser(row.canDisable);
        setUserId(row.id);
        setShowDisableModal(true);
    };

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDisableUser,
    });

    const fetchAllUserList = async () => {
        const tempUser = location.state?.tempUser;
        const response = await userApi.getUserList(
            1,
            {
                query: debouncedKeyword,
                type: selectedType,
            },
            {
                page: currentPage - 1,
                // size: tempUser ? 19 : 20,
                size: pageSize,
                sortBy: sortFieldForApi,
                sortDir: orderBy,
            }
        );

        let users = response.data.content;

        if (tempUser) {
            users = users.filter((u) => u.id !== tempUser.id);
            users.unshift(tempUser);
        }
        setUserData({ ...response, data: { ...response.data, content: users } });
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAllUserList();
    }, [selectedType, sortFieldForApi, orderBy, currentPage, pageSize, debouncedKeyword]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedKeyword) params.set("keyword", debouncedKeyword);
        if (selectedType) params.set("type", selectedType);
        params.set("page", currentPage.toString());
        params.set("sortBy", sortBy);
        params.set("orderBy", orderBy);
        params.set("size", pageSize.toString());
        const newSearch = params.toString();
        if (location.search !== `?${newSearch}`) {
            navigate(
                {
                    pathname: location.pathname,
                    search: newSearch,
                },
                { replace: false }
            );
        }
        userData?.data.content.splice(0);
        setIsLoading(true);
    }, [debouncedKeyword, selectedType, sortBy, orderBy, currentPage, pageSize]);

    useEffect(() => {
        setSelectedType(searchParams.get("type") || "");
        setTextSearch(searchParams.get("keyword") || "");
        setSortBy(searchParams.get("sortBy") || "firstName");
        setOrderBy(searchParams.get("orderBy") || "asc");
        setCurrentPage(Number(searchParams.get("page")) || 1);
        setPageSize(Number(searchParams.get("size")) || 20);
    }, [searchParams]);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (showModal) {
                setShowModal(false);
            }
            if (showDisableModal) {
                setShowDisableModal(false);
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [showModal, showDisableModal]);

    return (
        <>
            <ContentWrapper title={"User List"}>
                <div className="flex justify-between items-center w-full mb-[20px] z-20">
                    <div className="min-w-[220px]">
                        <SelectFilter
                            placeholder="Type"
                            options={options}
                            selected={selectedType}
                            onSelect={(value) => {
                                setSelectedType(value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex flex items-center gap-4 flex-shrink-0">
                        <div className="w-[250px]">
                            <SearchInput onSearch={handleSearch} value={textSearch} />
                        </div>
                        <Button text="Create new user" color="primary" onClick={() => navigate("create")} />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={userData?.data.content ?? []}
                    onSort={(key, direction) => {
                        setSortBy(key);
                        if (key === "fullName") {
                            setSortFieldForApi("firstName");
                        } else {
                            setSortFieldForApi(key);
                        }
                        setOrderBy(direction);
                    }}
                    onRowClick={(id) => handleClickRow(id)}
                    sortBy={sortBy as keyof User}
                    orderBy={orderBy}
                    isDataLoading={isLoading}
                />
                <div className="flex justify-between items-center w-full m-auto mt-[20px]">
                    <span className="text-2xl text-gray-500 font-semibold w-1/4">
                        {userData?.data.totalElements ?? 0}{" "}
                        {userData?.data.totalElements === 1 ? "result" : "results"} found
                    </span>
                    <div className="flex justify-end w-full">
                        <PageSizeSelect value={pageSize} setValue={setPageSize} onChange={() => setCurrentPage(1)}/>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={userData?.data.totalPages ?? 0}
                            onPageChange={handlePageChange}
                            maxVisiblePages={3}
                        />
                    </div>
                </div>
            </ContentWrapper>

            {showModal && (
                <DetailUser showModal={showModal} closeModal={() => setShowModal(false)} userId={userId} />
            )}

            {showDisableModal && (
                <DisableUser
                    isDisable={isDisableUser}
                    userId={userId}
                    showModal={showDisableModal}
                    onSuccess={() => {
                        setShowDisableModal(false);
                        fetchAllUserList();
                    }}
                    closeModal={() => setShowDisableModal(false)}
                />
            )}
        </>
    );
};

export default ManageUser;
