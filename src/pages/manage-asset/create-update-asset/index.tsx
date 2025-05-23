import React, { useState, useRef, useEffect } from 'react'
import ContentWrapper from '../../../components/ui/content-wrapper'
import { useNavigate, useParams } from 'react-router-dom'
import InputField from '../../../components/ui/input'
import DateFilter from '../../../components/ui/date-filter'
import Button from '../../../components/ui/button'
import { useForm, Controller } from 'react-hook-form'
import { CategoryListResponse } from '../../../types/category'
import categoryApi from '../../../api/categoryApi'
import assetApi from '../../../api/assetApi'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import axios from 'axios'
import CancelModal from '../../../components/ui/cancel-modal'

type FormFields = {
  name: string;
  category: string;
  specification: string;
  installedDate: Date;
  state: "AVAILABLE" | "NOT_AVAILABLE" | "ASSIGNED" | "WAITING" | "RECYCLED";
}

const CreateUpdateAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    setError,
    formState: { errors, isValid }
  } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: {
      state: "AVAILABLE"
    }
  });

  const [categories, setCategories] = useState<CategoryListResponse[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newPrefix, setNewPrefix] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCategory = watch("category");

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await categoryApi.getCategoryList();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch category list", error);
      }
    };

    const fetchAssetDetail = async () => {
      try {
        const response = await assetApi.getAssetDetail(Number(id));
        const detail = response.data;
        setValue("name", detail.name);
        setValue("specification", detail.specification);
        setValue("category", detail.category);
        setValue("installedDate", new Date(detail.installedDate));
        setValue("state", detail.status as "AVAILABLE" | "NOT_AVAILABLE" | "ASSIGNED" | "WAITING" | "RECYCLED");
        trigger();
      }
      catch (error) {
        console.error(error);
        setNotFoundError(true);
      }
    }

    if (!isEdit) {
      fetchCategoryList();
    }
    else {
      fetchAssetDetail();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEdit, id]);

  const onSubmit = async (data: FormFields) => {
    try {
      if (isEdit) {
        const response = await assetApi.editAsset(1, Number(id), {
          name: data.name,
          installedDate: format(data.installedDate, "yyyy-MM-dd"),
          specification: data.specification,
          state: data.state
        });
        toast.success("Asset updated successfully");
        navigate("/manage-asset", {
          state: {
            tempAsset: response.data
          }
        });
      } else {
        if (!categoryId) {
          setCategoryError("Please select a valid category");
          return;
        }

        const payload = {
          name: data.name,
          categoryId: categoryId,
          specification: data.specification,
          installedDate: format(data.installedDate, 'yyyy-MM-dd'),
          state: data.state.toUpperCase() as "AVAILABLE" | "NOT_AVAILABLE" | "ASSIGNED" | "WAITING" | "RECYCLED"
        };

        const response = await assetApi.createAsset(1, payload);
        toast.success("Asset created successfully");
        navigate("/manage-asset", {
          state: {
            tempAsset: {
              ...response.data,
              status: response.data.state
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorMessage = (error.response?.data as { message?: string })?.message || "Server error";
        toast.error(errorMessage);
        if (errorMessage === "Asset name already exists in this location. Please choose a different name.") {
          setError("name", {
            type: "custom",
            message: "This field is unique"
          });
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const handleAddCategory = async () => {
    setCategoryError('');

    if (newCategoryName.trim().length === 0) {
      setCategoryError("Category name is required");
      return;
    }

    if (newPrefix.trim().length === 0) {
      setCategoryError("Prefix is required");
      return;
    }

    if (newPrefix.trim().length > 2) {
      setCategoryError("Prefix must be at most 2 characters long");
      return;
    }

    try {
      const response = await categoryApi.createCategory({
        name: newCategoryName,
        prefix: newPrefix
      });

      toast.success("Category created successfully");
      const newCategory = response.data;
      setNewCategoryName('');
      setNewPrefix('');
      setCategories(prev => [...prev, newCategory])
      setShowAddCategoryForm(false);
      setValue("category", newCategory.name);
      setCategoryId(newCategory.id);
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = (error.response?.data as { message?: string })?.message || "Server error";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    }

  }

  const handleCancel = () => {
    const formValues = watch();

    const hasAnyInput =
      formValues.name?.trim() ||
      formValues.category?.trim() ||
      formValues.specification?.trim() ||
      formValues.installedDate;

    if (hasAnyInput) {
      setShowModal(true);
    } else {
      navigate("/manage-asset");
    }
  };

  const selectCategory = (categoryName: string) => {
    setValue("category", categoryName);
    const found = categories.find(c => c.name === categoryName);
    if (found) setCategoryId(found.id);
    setIsDropdownOpen(false);
  }


  return (
    <>
      <ContentWrapper title={isEdit ? 'Edit Asset' : 'Create New Asset'}>
        {notFoundError ? (
          <p className='text-center'>Asset not found -_-</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-3 gap-y-6 items-center text-[1.6rem] max-w-3xl"
          >
            {/* Name */}
            <label htmlFor="name" className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Name</label>
            <div className="col-span-2">
              <InputField
                id="name"
                {...register("name", {
                  required: "This field is required",
                  maxLength: {
                    value: 255,
                    message: "You have reached your maximum limit of characters allowed"
                  },
                })}
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <label htmlFor="category" className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Category</label>
            <div className="col-span-2 relative" ref={dropdownRef}>
              <input
                type="hidden"
                {...register("category", { required: "This field is required" })}
              />
              <div
                className={`w-full border border-gray-500 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer ${isEdit ? "bg-gray-300" : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedCategory || ""}</span>
                <i className={`fa-solid fa-caret-${isDropdownOpen && !isEdit ? 'up' : 'down'}`}></i>
              </div>
              {isDropdownOpen && !isEdit && (
                <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-md bg-white shadow-lg">
                  {/* Scrollable list */}
                  <div className="max-h-60 overflow-y-auto">
                    {categories.map(c => (
                      <div
                        key={c.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectCategory(c?.name)}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>

                  {/* Static Add New Category Section */}
                  <div className="border-t border-gray-200 bg-white sticky bottom-0">
                    {!showAddCategoryForm ? (
                      <div
                        className="px-4 py-2 text-blue-600 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddCategoryForm(true);
                        }}
                      >
                        + Add new category
                      </div>
                    ) : (
                      <div className="p-2">
                        <div className="flex items-center gap-2">
                          <InputField
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            onClick={e => e.stopPropagation()}
                          />
                          <InputField
                            placeholder="Prefix"
                            value={newPrefix}
                            onChange={e => setNewPrefix(e.target.value)}
                            onClick={e => e.stopPropagation()}
                          />
                          <button type="button" onClick={(e) => { e.stopPropagation(); handleAddCategory(); }}>
                            <i className="fa-solid fa-check text-green-500"></i>
                          </button>
                          <button type="button" onClick={(e) => {
                            e.stopPropagation();
                            setShowAddCategoryForm(false);
                            setNewCategoryName('');
                            setNewPrefix('');
                            setCategoryError('');
                          }}>
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        {categoryError && <p className="text-red-500">{categoryError}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>


            {/* Specification */}
            <label htmlFor="specification" className="pr-4 after:content-['*'] after:text-red-500 after:ml-2 self-start">Specification</label>
            <div className="col-span-2">
              <textarea
                id="specification"
                {...register("specification", { required: "This field is required" })}
                className="w-full border border-gray-500 rounded-md px-4 py-2 resize-none h-[100px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.specification && <p className="text-red-500">{errors.specification.message}</p>}
            </div>

            {/* Installed Date */}
            <label className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Installed Date</label>
            <div className="col-span-2">
              <Controller
                control={control}
                name="installedDate"
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <DateFilter label="" selectedDate={field.value} onSelect={field.onChange} />
                )}
              />
              {errors.installedDate && <p className="text-red-500">{errors.installedDate.message}</p>}
            </div>

            {/* State */}
            <label className="pr-4 after:content-['*'] after:text-red-500 after:ml-2 self-start">State</label>
            <div className="col-span-2 flex flex-col">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="AVAILABLE"
                  {...register("state", { required: "This field is required" })}
                  className="accent-[var(--primary-color)]"
                />
                Available
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="NOT_AVAILABLE"
                  {...register("state", { required: "This field is required" })}
                  className="accent-[var(--primary-color)]"
                />
                Not Available
              </label>
              {isEdit && (
                <>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="WAITING"
                      {...register("state", { required: "This field is required" })}
                      className="accent-[var(--primary-color)]"
                    />
                    Waiting for recycling
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="RECYCLED"
                      {...register("state", { required: "This field is required" })}
                      className="accent-[var(--primary-color)]"
                    />
                    Recycled
                  </label>
                </>
              )}
              {errors.state && <p className="text-red-500">{errors.state.message}</p>}
            </div>

            {/* Actions */}
            <div className="col-start-2 col-span-2 flex justify-end gap-4 mt-6">
              <Button text="Save" color="primary" disabled={!isValid} />
              <Button color="outline" text="Cancel" type='button' onClick={handleCancel} />
            </div>
          </form>
        )}
      </ContentWrapper>

      {showModal &&
        <CancelModal
          showModal={showModal}
          onSuccess={() => {
            setShowModal(false);
            navigate("/manage-asset");
          }}
          content='Do you want to cancel your action?'
          closeModal={() => setShowModal(false)}
        />
      }
    </>
  )
}

export default CreateUpdateAsset