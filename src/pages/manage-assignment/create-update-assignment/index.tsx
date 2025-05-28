import { useState, useEffect, useCallback, useMemo } from "react";
import ContentWrapper from "../../../components/ui/content-wrapper";
import { useNavigate, useParams } from "react-router-dom";
import DateFilter from "../../../components/ui/date-filter";
import Button from "../../../components/ui/button";
import { useForm, Controller } from "react-hook-form";
import CancelModal from "../../../components/ui/cancel-modal";
import FormModalWithSearch from "../../../components/ui/form-modal-with-search";
import Table, { Column } from "../../../components/ui/table";
import { CreateAssignmentRequest } from "../../../types/assignment";
import { UserBrief } from "../../../types";
import { AssetBrief } from "../../../types/asset";
import userApi from "../../../api/userApi";
import assetApi from "../../../api/assetApi";
import { isBefore, startOfDay } from "date-fns";
import assignmentApi from "../../../api/assignmentApi";
import { toast } from "react-toastify";

interface FormModalState<T> {
  pickedItem: T;
  sortBy: keyof T;
  sortDir: "asc" | "desc";
  query: string | null;
}

// Custom hook to manage modal state
const useModalState = <T,>(defaultSortKey: keyof T, defaultItem: T) => {
  const [state, setState] = useState<FormModalState<T>>({
    pickedItem: defaultItem,
    sortBy: defaultSortKey,
    sortDir: "asc",
    query: null,
  });

  const updateState = useCallback((updates: Partial<FormModalState<T>>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState] as const;
};

// Custom hook to fetch data
const useDataFetching = () => {
  const [allUsers, setAllUsers] = useState<UserBrief[]>([]);
  const [allAssets, setAllAssets] = useState<AssetBrief[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(
    async (
      query?: string | null,
      sortBy?: keyof UserBrief,
      sortDir?: "asc" | "desc"
    ) => {
      try {
        const response = await userApi.getAllUsers({
          query,
          sortBy: sortBy === "fullName" ? "firstName" : sortBy,
          sortDir,
        });
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    []
  );

  const fetchAssets = useCallback(
    async (
      query?: string | null,
      sortBy?: keyof AssetBrief,
      sortDir?: "asc" | "desc"
    ) => {
      try {
        const response = await assetApi.getAllAssets({
          query,
          sortBy: sortBy === "assetName" ? "name" : sortBy,
          sortDir,
        });
        setAllAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    },
    []
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchAssets()]);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, fetchAssets]);

  return {
    allUsers,
    allAssets,
    loading,
    fetchUsers,
    fetchAssets,
    fetchAll,
  };
};

// Main component
const CreateUpdateAssignment = () => {
  // State management
  const [modals, setModals] = useState({
    showCancel: false,
    showSelectUser: false,
    showSelectAsset: false,
  });

  const [selectedItems, setSelectedItems] = useState({
    user: {} as UserBrief,
    asset: {} as AssetBrief,
  });

  const [notFoundError, setNotFoundError] = useState(false);

  // Modal states using custom hook
  const [userModalState, updateUserModalState] = useModalState<UserBrief>(
    "firstName",
    {} as UserBrief
  );
  const [assetModalState, updateAssetModalState] = useModalState<AssetBrief>(
    "assetCode",
    {} as AssetBrief
  );

  // Data fetching
  const { allUsers, allAssets, fetchUsers, fetchAssets, fetchAll } =
    useDataFetching();

  // Route params
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  // Form configuration
  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateAssignmentRequest>({
    mode: "onChange",
  });

  // Memoized columns to avoid re-render unnecessarily
  const userColumns = useMemo(
    (): Column<UserBrief>[] => [
      { key: "staffCode", title: "Staff Code" },
      { key: "fullName", title: "Full Name" },
      { key: "role", title: "Type" },
    ],
    []
  );

  const assetColumns = useMemo(
    (): Column<AssetBrief>[] => [
      { key: "assetCode", title: "Asset Code" },
      { key: "assetName", title: "Asset Name" },
      { key: "categoryName", title: "Category" },
    ],
    []
  );

  // Effects
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Fetch users when user modal state change
  useEffect(() => {
    if (modals.showSelectUser) {
      fetchUsers(
        userModalState.query,
        userModalState.sortBy,
        userModalState.sortDir
      );
    }
  }, [
    modals.showSelectUser,
    userModalState.query,
    userModalState.sortBy,
    userModalState.sortDir,
    fetchUsers,
  ]);

  // Fetch assets when asset modal state change
  useEffect(() => {
    if (modals.showSelectAsset) {
      fetchAssets(
        assetModalState.query,
        assetModalState.sortBy,
        assetModalState.sortDir
      );
    }
  }, [
    modals.showSelectAsset,
    assetModalState.query,
    assetModalState.sortBy,
    assetModalState.sortDir,
    fetchAssets,
  ]);

  // Event handlers
  const updateModal = useCallback(
    (modalName: keyof typeof modals, value: boolean) => {
      setModals((prev) => ({ ...prev, [modalName]: value }));
    },
    []
  );

  const onSubmit = async (data: CreateAssignmentRequest) => {
    try {
      console.log(data);
      await assignmentApi.createAssignment(data);
      toast.success("Assignment created successfully");
      navigate("/manage-assignment");
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  const handleSubmitSelectUser = useCallback(() => {
    setSelectedItems((prev) => ({ ...prev, user: userModalState.pickedItem }));
    setValue("userId", userModalState.pickedItem?.id || 0);
    updateModal("showSelectUser", false);
    // Trigger validation for assignDate because assignDate cannot auto trigger
    trigger("assignedDate");
  }, [userModalState.pickedItem, setValue, updateModal, trigger]);

  const handleSubmitSelectAsset = useCallback(() => {
    setSelectedItems((prev) => ({
      ...prev,
      asset: assetModalState.pickedItem,
    }));
    setValue("assetId", assetModalState.pickedItem?.id || 0);
    updateModal("showSelectAsset", false);
    // Trigger validation for assignDate because assignDate cannot auto trigger
    trigger("assignedDate");
  }, [assetModalState.pickedItem, setValue, updateModal, trigger]);

  const handleCancel = useCallback(() => {
    const formValues = getValues();

    const hasAnyInput =
      formValues.userId ||
      formValues.assetId ||
      formValues.assignedDate ||
      formValues.note?.trim();

    if (hasAnyInput) {
      updateModal("showCancel", true);
    } else {
      navigate("/manage-assignment");
    }
  }, [updateModal, navigate, getValues]);

  const handleCancelConfirm = useCallback(() => {
    updateModal("showCancel", false);
    navigate("/manage-assignment");
  }, [updateModal, navigate]);

  return (
    <>
      <ContentWrapper
        title={isEdit ? "Edit Assignment" : "Create New Assignment"}
      >
        {notFoundError ? (
          <p className="text-center">Assignment not found -_-</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-3 gap-y-6 items-center text-[1.6rem] max-w-3xl"
          >
            {/* User Selection */}
            <label
              htmlFor="userId"
              className="pr-4 after:content-['*'] after:text-red-500 after:ml-2"
            >
              User
            </label>
            <div className="col-span-2">
              <input
                type="hidden"
                {...register("userId", { required: "This field is required" })}
              />
              <div
                className={`w-full border border-gray-500 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer ${
                  isEdit ? "bg-gray-300" : ""
                }`}
                onClick={() => updateModal("showSelectUser", true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    updateModal("showSelectUser", true);
                  }
                }}
              >
                <span>{selectedItems.user?.fullName || "\u00A0"}</span>
                <i
                  className={`fa-solid ${
                    isEdit ? "fa-caret-down" : "fa-magnifying-glass"
                  }`}
                  aria-hidden="true"
                />
              </div>
              {errors.userId && (
                <p className="text-red-500">{errors.userId.message}</p>
              )}
            </div>

            {/* Asset Selection */}
            <label
              htmlFor="assetId"
              className="pr-4 after:content-['*'] after:text-red-500 after:ml-2"
            >
              Asset
            </label>
            <div className="col-span-2">
              <input
                type="hidden"
                {...register("assetId", { required: "This field is required" })}
              />
              <div
                className={`w-full border border-gray-500 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer ${
                  isEdit ? "bg-gray-300" : ""
                }`}
                onClick={() => updateModal("showSelectAsset", true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    updateModal("showSelectAsset", true);
                  }
                }}
              >
                <span className="truncate flex-1 w-full">
                  {selectedItems.asset?.assetName || "\u00A0"}
                </span>
                <i
                  className={`h-full fa-solid ${
                    isEdit ? "fa-caret-down" : "fa-magnifying-glass"
                  }`}
                  aria-hidden="true"
                />
              </div>
              {errors.assetId && (
                <p className="text-red-500">{errors.assetId.message}</p>
              )}
            </div>

            {/* Assigned Date */}
            <label className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">
              Assigned Date
            </label>
            <div className="col-span-2">
              <Controller
                control={control}
                name="assignedDate"
                defaultValue={new Date()}
                rules={{
                  validate: (value) => {
                    if (isBefore(value, startOfDay(new Date()))) {
                      return "Date must be today or in the future";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DateFilter
                    label={" "}
                    selectedDate={field.value}
                    onSelect={field.onChange}
                  />
                )}
              />
              {errors.assignedDate && (
                <p className="text-red-500">{errors.assignedDate.message}</p>
              )}
            </div>

            {/* Note */}
            <label htmlFor="note" className="pr-4 self-start">
              Note
            </label>
            <div className="col-span-2">
              <textarea
                id="note"
                {...register("note")}
                className="w-full border border-gray-500 rounded-md px-4 py-2 resize-none h-[80px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="col-start-2 col-span-2 flex justify-end gap-4 mt-6">
              <Button text="Save" color="primary" disabled={!isValid} />
              <Button
                color="outline"
                text="Cancel"
                type="button"
                onClick={handleCancel}
              />
            </div>
          </form>
        )}
      </ContentWrapper>

      {/* Modals */}
      {modals.showCancel && (
        <CancelModal
          showModal={modals.showCancel}
          onSuccess={handleCancelConfirm}
          content="Do you want to cancel your action?"
          closeModal={() => updateModal("showCancel", false)}
        />
      )}

      {modals.showSelectUser && (
        <FormModalWithSearch
          title="Select User"
          closeModal={() => updateModal("showSelectUser", false)}
          onSearchInput={(query) => updateUserModalState({ query })}
          onSubmit={handleSubmitSelectUser}
          isDisableSubmit={
            JSON.stringify(selectedItems.user) ===
            JSON.stringify(userModalState.pickedItem)
          }
        >
          <Table
            columns={userColumns}
            isSelect
            onSelected={(row) => updateUserModalState({ pickedItem: row })}
            isSort
            onSort={(key, direction) =>
              updateUserModalState({ sortBy: key, sortDir: direction })
            }
            data={allUsers}
            sortBy={userModalState.sortBy}
            orderBy={userModalState.sortDir}
            selectedObject={selectedItems.user}
          />
        </FormModalWithSearch>
      )}

      {modals.showSelectAsset && (
        <FormModalWithSearch
          title="Select Asset"
          closeModal={() => updateModal("showSelectAsset", false)}
          onSearchInput={(query) => updateAssetModalState({ query })}
          onSubmit={handleSubmitSelectAsset}
          isDisableSubmit={
            JSON.stringify(selectedItems.asset) ===
            JSON.stringify(assetModalState.pickedItem)
          }
        >
          <Table
            columns={assetColumns}
            isSelect
            onSelected={(row) => updateAssetModalState({ pickedItem: row })}
            isSort
            onSort={(key, direction) =>
              updateAssetModalState({ sortBy: key, sortDir: direction })
            }
            data={allAssets}
            sortBy={assetModalState.sortBy}
            orderBy={assetModalState.sortDir}
            selectedObject={selectedItems.asset}
          />
        </FormModalWithSearch>
      )}
    </>
  );
};

export default CreateUpdateAssignment;

