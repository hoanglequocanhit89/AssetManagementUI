import { useState, useEffect, useCallback, useMemo } from "react";
import ContentWrapper from "../../../components/ui/content-wrapper";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DateFilter from "../../../components/ui/date-filter";
import Button from "../../../components/ui/button";
import { useForm, Controller } from "react-hook-form";
import CancelModal from "../../../components/ui/cancel-modal";
import FormModalWithSearch from "../../../components/ui/form-modal-with-search";
import Table, { Column } from "../../../components/ui/table";
import { CreateUpdateAssignmentRequest } from "../../../types/assignment";
import { UserBrief } from "../../../types";
import { AssetBrief } from "../../../types/asset";
import userApi from "../../../api/userApi";
import assetApi from "../../../api/assetApi";
import { isBefore, startOfDay } from "date-fns";
import assignmentApi from "../../../api/assignmentApi";
import { toast } from "react-toastify";
import axios from "axios";
import { compareObject } from "../../../utils/compareObject";

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
  // Push state of modal to URL to back to form when hit back button
  const [searchParams, setSearchParams] = useSearchParams();
  const modalParam = searchParams.get("modal");
  useEffect(() => {
    setModals((prev) => ({
      ...prev,
      showSelectUser: modalParam === "user",
      showSelectAsset: modalParam === "asset",
    }));
  }, [modalParam]);
  // Remove modal param from URL
  const removeModalParam = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("modal");
    setSearchParams(params);
  },[searchParams, setSearchParams]);

  const [defaultAssignment, setDefaultAssignment] =
    useState<CreateUpdateAssignmentRequest>({
      assignedDate: new Date(),
    } as CreateUpdateAssignmentRequest);

  const [selectedItems, setSelectedItems] = useState({
    user: {} as UserBrief,
    asset: {} as AssetBrief,
  });

  const [notFoundError, setNotFoundError] = useState(false);

  // Modal states using custom hook
  const [userModalState, setUserModalState] = useModalState<UserBrief>(
    "firstName",
    {} as UserBrief
  );
  const [assetModalState, setAssetModalState] = useModalState<AssetBrief>(
    "assetCode",
    {} as AssetBrief
  );

  // Data fetching
  const { allUsers, allAssets, fetchUsers, fetchAssets, fetchAll, loading } =
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
  } = useForm<CreateUpdateAssignmentRequest>({
    mode: "onChange",
    defaultValues: defaultAssignment,
  });

  // Memoized columns to avoid re-render unnecessarily
  const userColumns = useMemo(
    (): Column<UserBrief>[] => [
      { key: "staffCode", title: "Staff Code" },
      { key: "fullName", title: "Full Name" },
      { key: "role", title: "Type",
        render: (value) => {
          const strValue = String(value);
          return (
              <p>
                  {strValue
                      ? strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase()
                      : ""}
              </p>
          );
      }
       },
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

  const getAssignmentToUpdate = useMemo(
    () => async () => {
      try {
        const response = await assignmentApi.getAssignmentToUpdate(Number(id));
        const exitingAssignment = response.data;
        setValue("userId", exitingAssignment.user.id);
        setValue("assetId", exitingAssignment.asset.id);
        setValue("assignedDate", new Date(exitingAssignment.assignedDate));
        setValue("note", exitingAssignment.note);
        setDefaultAssignment({
          userId: exitingAssignment.user.id,
          assetId: exitingAssignment.asset.id,
          assignedDate: new Date(exitingAssignment.assignedDate),
          note: exitingAssignment.note,
        });

        setAssetModalState({
          ...assetModalState,
          pickedItem: exitingAssignment.asset,
        });
        setUserModalState({
          ...userModalState,
          pickedItem: exitingAssignment.user,
        });

        setSelectedItems({
          user: exitingAssignment.user,
          asset: exitingAssignment.asset,
        });
      } catch (error) {
        toast.error("Failed to get assignment to update.");
        setNotFoundError(true);
      }
    },
    [id]
  );

  // Fetch all users and assets when the component mounts
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Fetch assignment to update
  useEffect(() => {
    if (isEdit && !loading) {
      getAssignmentToUpdate();
    }
  }, [isEdit, getAssignmentToUpdate, loading]);

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

  const onSubmit = async (data: CreateUpdateAssignmentRequest) => {
    try {
      let response;
      if (isEdit) {
        response = await assignmentApi.editAssignment(Number(id), data);
        toast.success("Assignment updated successfully");
      } else {
        response = await assignmentApi.createAssignment(data);
        toast.success("Assignment created successfully");
      }
      navigate("/manage-assignment", {
        state: {
          tempAsset: response.data,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          (error.response?.data as { message?: string })?.message ||
          "Server error";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleSubmitSelectUser = useCallback(() => {
    setSelectedItems((prev) => ({ ...prev, user: userModalState.pickedItem }));
    setValue("userId", userModalState.pickedItem?.id || 0);
    updateModal("showSelectUser", false);
    removeModalParam();
    // Trigger validation for assignDate because assignDate cannot auto trigger
    trigger("assignedDate");
  }, [userModalState.pickedItem, setValue, updateModal, trigger, removeModalParam]);

  const handleSubmitSelectAsset = useCallback(() => {
    setSelectedItems((prev) => ({
      ...prev,
      asset: assetModalState.pickedItem,
    }));
    setValue("assetId", assetModalState.pickedItem?.id || 0);
    updateModal("showSelectAsset", false);
    removeModalParam();
    // Trigger validation for assignDate because assignDate cannot auto trigger
    trigger("assignedDate");
  }, [assetModalState.pickedItem, setValue, updateModal, trigger, removeModalParam]);

  const isFormChanged = useCallback(() => {
    const formValues = getValues();
    const defaultFormValues = {
      userId: defaultAssignment.userId || "",
      assetId: defaultAssignment.assetId || "",
      assignedDate: defaultAssignment.assignedDate || "",
      note: defaultAssignment.note || "",
    };
    return !compareObject(formValues, defaultFormValues);
  }, [getValues, defaultAssignment]);

  const handleCancel = useCallback(() => {
    // Check to show cancel modal if the form values are changed
    if (isFormChanged()) {
      updateModal("showCancel", true);
    } else {
      navigate("/manage-assignment");
    }
  }, [isFormChanged, navigate, updateModal]);

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
                className={
                  "w-full border border-gray-500 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer "
                }
                onClick={() => {
                  updateModal("showSelectUser", true);
                  setSearchParams({ modal: "user" });
                }}
                role="button"
                tabIndex={0}
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
                className={`w-full border border-gray-500 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer`}
                onClick={() => {
                  updateModal("showSelectAsset", true);
                  setSearchParams({ modal: "asset" });
                }}
                role="button"
                tabIndex={0}
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
                      return "Assigned date cannot be in the past. Please select a different date";
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
                {...register("note", {
                  maxLength: {
                    value: 255,
                    message: "Note must limit to 255 characters",
                  },
                })}
                className="w-full border border-gray-500 rounded-md px-4 py-2 resize-none h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.note && (
                <p className="text-red-500">{errors.note.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="col-start-2 col-span-2 flex justify-end gap-4 mt-6">
              <Button
                text="Save"
                color="primary"
                disabled={!isValid || !isFormChanged()}
              />
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
          closeModal={() => {
            updateModal("showSelectUser", false);
            removeModalParam();
          }}
          onSearchInput={(query) => setUserModalState({ query })}
          onSubmit={handleSubmitSelectUser}
          isDisableSubmit={
            selectedItems.user.id === userModalState.pickedItem.id
          }
        >
          <Table
            columns={userColumns}
            isSelect
            onSelected={(row) => setUserModalState({ pickedItem: row })}
            isSort
            onSort={(key, direction) =>
              setUserModalState({ sortBy: key, sortDir: direction })
            }
            data={allUsers}
            sortBy={userModalState.sortBy}
            orderBy={userModalState.sortDir}
            selectedObject={selectedItems.user}
            isDataLoading={loading}
          />
        </FormModalWithSearch>
      )}

      {modals.showSelectAsset && (
        <FormModalWithSearch
          title="Select Asset"
          closeModal={() => {
            updateModal("showSelectAsset", false);
            removeModalParam();
          }}
          onSearchInput={(query) => setAssetModalState({ query })}
          onSubmit={handleSubmitSelectAsset}
          isDisableSubmit={
            selectedItems.asset.id === assetModalState.pickedItem.id
          }
        >
          <Table
            columns={assetColumns}
            isSelect
            onSelected={(row) => setAssetModalState({ pickedItem: row })}
            isSort
            onSort={(key, direction) =>
              setAssetModalState({ sortBy: key, sortDir: direction })
            }
            data={allAssets}
            sortBy={assetModalState.sortBy}
            orderBy={assetModalState.sortDir}
            selectedObject={selectedItems.asset}
            isDataLoading={loading}
          />
        </FormModalWithSearch>
      )}
    </>
  );
};

export default CreateUpdateAssignment;
