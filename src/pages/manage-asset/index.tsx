import ContentWrapper from "../../components/ui/content-wrapper";
import Table, { Column } from "../../components/ui/table";
import { useEffect, useState } from "react";
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

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());
}

const getColumns = (handlers: {
  onEdit: (row: Asset) => void;
  onDelete: (row: Asset) => void;
}): Column<Asset>[] => [
    { key: "assetCode", title: "Asset Code" },
    { key: "name", title: "Asset Name" },
    { key: "categoryName", title: "Category" },
    { key: "status", title: "State", render: (value) => formatStatus(value as string) },
    {
      key: "action",
      actions: [
        {
          render: (row) => (
            <button disabled={row.status === "ASSIGNED"}>
              <i
                className={`fa-solid fa-pen ${row.status === "ASSIGNED" ? "opacity-50 cursor-default" : ""
                  }`}
                title="Edit"
              ></i>
            </button>
          ),
          onClick: handlers.onEdit,
        },
        {
          render: (row) => (
            <button disabled={row.status === "ASSIGNED"}>
              <i
                className={`fa-regular fa-circle-xmark text-[var(--primary-color)] 
                                    ${row.status === "ASSIGNED"
                    ? "opacity-50 cursor-default"
                    : ""
                  }`}
                title="Delete"
              ></i>
            </button>
          ),
          onClick: handlers.onDelete,
        },
      ],
    },
  ];

const stateArr = [
  {
    value: "AVAILABLE",
    label: "Available",
  },
  {
    value: "NOT_AVAILABLE",
    label: "Not available",
  },
  {
    value: "ASSIGNED",
    label: "Assigned",
  },
  {
    value: "RECYCLED",
    label: "Recycled",
  },
  {
    value: "WAITING",
    label: "Waiting",
  },
  {
    value: "",
    label: "All",
  },
];

interface CategoryProps {
  value: string;
  label: string;
}

interface PagingProps {
  currentPage: number;
  totalPage: number;
}

interface SortFilterProps {
  sortBy: string;
  sortDir: string;
}

const ManageAsset = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewDetailModal, setViewDetailModal] = useState<boolean>(false);
  const [viewDeleteModal, setViewDeleteModal] = useState<boolean>(false);
  const [editAssetId, setEditAssetId] = useState<number>(0);
  const [isAssetDeletable, setIsAssetDeletable] = useState<boolean>(false);
  const [stateFilter, setStateFilter] = useState<string>(
    searchParams.get("states") || ""
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(
    searchParams.get("categoryName") || ""
  );
  const [pagingData, setPagingData] = useState<PagingProps>({
    currentPage: Number(searchParams.get("page")) || 1,
    totalPage: 0,
  });
  const [searchFilter, setSearchFilter] = useState<string>(
    searchParams.get("keyword") || ""
  );
  const [categoryList, setCategoryList] = useState<CategoryProps[]>([]);
  const [sortFilter, setSortFilter] = useState<SortFilterProps>({
    sortBy: searchParams.get("sortBy") || "",
    sortDir: searchParams.get("sortDir") || "",
  });
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [detailAssetData, setDetailAssetData] = useState<AssetDetail>({
    id: 0,
    canDelete: false,
    assetCode: "",
    assignments: [],
    categoryName: "",
    status: "",
    category: "",
    installedDate: "",
    location: "",
    name: "",
    specification: "",
    state: "",
  });
  const [isAssetDetailLoading, setIsAssetDetailLoading] =
    useState<boolean>(false);

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
          sortDir: sortFilter.sortDir,
        },
      });
      if (response.data) {
        let assets = response.data.content;

        if (tempAsset) {
          assets = assets.filter((a) => a.id !== tempAsset.id);
          assets.unshift(tempAsset);
          setAssetList(assets);
        } else {
          setAssetList([...response.data.content]);
        }

        setPagingData({
          ...pagingData,
          totalPage: response.data.totalPages,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await assetApi.getCategoryList();
      const cateArr = [...response.data].map((item) => ({
        value: item.name,
        label: item.name,
      }));
      response && setCategoryList([...cateArr, { value: "", label: "All" }]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  useEffect(() => {
    setStateFilter(searchParams.get("states") || "");
    setCategoryFilter(searchParams.get("categoryName") || "");
    setPagingData({
      currentPage: Number(searchParams.get("page")) || 1,
      totalPage: 0,
    });
    setSearchFilter(searchParams.get("keyword") || "");
    setSortFilter({
      sortBy: searchParams.get("sortBy") || "",
      sortDir: searchParams.get("sortDir") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    assetList.length = 0;
    setIsLoading(true);
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("keyword", debouncedKeyword);
    params.set("states", stateFilter);
    params.set("categoryName", categoryFilter);
    params.set("page", pagingData.currentPage.toString());
    params.set("sortBy", sortFilter.sortBy);
    params.set("sortDir", sortFilter.sortDir);
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
    fetchAssetList();
  }, [
    stateFilter,
    categoryFilter,
    debouncedKeyword,
    sortFilter.sortBy,
    sortFilter.sortDir,
    pagingData.currentPage,
  ]);

  useEffect(() => {
    const handlePopState = () => {
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

  const handleOnRowClick = async (id: number) => {
    setViewDetailModal(true);
    window.history.pushState({ modal: true }, "");
    try {
      setIsAssetDetailLoading(true);
      const response = await assetApi.getAssetDetail(id);
      setDetailAssetData({ ...response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsAssetDetailLoading(false);
    }
  };

  const handleEdit = (row: Asset) => {
    navigate(`edit/${row.id}`);
  };

  const handleDelete = async (row: Asset) => {
    setEditAssetId(row.id);
    setIsAssetDeletable(row.canDelete);
    setViewDeleteModal(true);
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const handleSort = (key: string, direction: string) => {
    setSortFilter({ ...sortFilter, sortBy: key, sortDir: direction });
  };

  const handleSearch = (value: string) => {
    setSearchFilter(value)
    pagingData.currentPage = 1;
  };

  return (
    <>
      <ContentWrapper title={'Asset List'}>
        <div className="d-flex gap-[20px] mb-[20px] z-20">
          <SelectFilter
            placeholder="State"
            options={stateArr}
            onSelect={(value) => setStateFilter(value)}
            selected={stateFilter}
          />

          <SearchSelect
            options={categoryList}
            onSelect={(value) => setCategoryFilter(value)}
            selected={categoryFilter}
            placeholder="Category"
          />
          <SearchInput value={searchFilter} onSearch={handleSearch} />
          <Button text="Create new asset" color="primary" onClick={() => navigate("create")} />
        </div>
        <Table
          columns={columns}
          data={assetList}
          sortBy={sortFilter.sortBy as keyof Asset}
          orderBy={sortFilter.sortDir as keyof Asset}
          onSort={handleSort}
          onRowClick={handleOnRowClick}
          isDataLoading={isLoading}
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
          setAssetList={(id) => setAssetList([...assetList.filter(item => item.id !== id)])}
        />
      }
    </>
  )
};

export default ManageAsset;
