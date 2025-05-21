import React, { useState, useRef, useEffect } from 'react'
import ContentWrapper from '../../../components/ui/content-wrapper'
import { useNavigate, useParams } from 'react-router-dom'
import InputField from '../../../components/ui/input'
import DateFilter from '../../../components/ui/date-filter'
import Button from '../../../components/ui/button'
import { useForm, Controller } from 'react-hook-form'

const initialCategories = [
  { id: 1, name: "Laptop", prefix: "LP" },
  { id: 2, name: "Monitor", prefix: "MO" },
]

type FormFields = {
  name: string;
  category: string;
  specification: string;
  installedDate: Date;
  state: string;
}

interface Asset {
  id: number;
  assetCode: string;
  assetName: string;
  category: string;
  specification: string;
  state: string;
  installedDate: Date;
};

const assetList: Asset[] = [
  {
    id: 1,
    assetCode: "LA100001",
    assetName: "Laptop HP Probook 450 G1",
    category: "Laptop",
    specification: "core i5",
    state: "available",
    installedDate: new Date("08/03/2018")
  },
  {
    id: 2,
    assetCode: "LA100001",
    assetName: "Monitor HP Probook 450 G1",
    category: "Monitor",
    state: "available",
    specification: "core i5",
    installedDate: new Date("08/03/2018")
  },
]

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
    formState: { errors, isValid }
  } = useForm<FormFields>({
    mode: 'onChange',
    defaultValues: {
      state: "available"
    }
  });

  const [categories, setCategories] = useState(initialCategories)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newPrefix, setNewPrefix] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [prefixError, setPrefixError] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedCategory = watch("category")

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isEdit) {
      const asset = assetList.find(a => a.id === Number(id));
      if (asset) {
        setValue("name", asset.assetName);
        setValue("specification", asset.specification);
        setValue("installedDate", asset.installedDate);
        setValue("state", asset.state);
        setValue("category", asset.category);

        trigger();
      }
    }
  }, [id]);

  const onSubmit = (data: FormFields) => {
    console.log('Submitted data:', data)
    // submit logic
  }

  const handleAddCategory = () => {
    setCategoryError('')
    setPrefixError('')
    const nameExists = categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())
    const prefixExists = categories.some(c => c.prefix.toLowerCase() === newPrefix.toLowerCase())

    if (nameExists) {
      setCategoryError("Category is already existed. Please enter a different category")
      return
    }

    if (prefixExists) {
      setPrefixError("Prefix is already existed. Please enter a different prefix")
      return
    }

    const newCategory = {
      id: Date.now(),
      name: newCategoryName,
      prefix: newPrefix
    }

    setCategories(prev => [...prev, newCategory])
    setNewCategoryName('')
    setNewPrefix('')
    setValue("category", newCategoryName)
    setShowAddCategoryForm(false)
    setCategoryError('')
    setPrefixError('')
  }

  const selectCategory = (categoryName: string) => {
    setValue("category", categoryName)
    setIsDropdownOpen(false)
  }

  return (
    <ContentWrapper title={isEdit ? 'Edit Asset' : 'Create New Asset'}>
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
                message: "Max length"
              },
              pattern: {
                value: /^[a-zA-Z0-9\s\-_,.]*$/,
                message: "Not allow special character"
              }
            })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Category - Custom Dropdown */}
        <label htmlFor="category" className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Category</label>
        <div className="col-span-2 relative" ref={dropdownRef}>
          {/* Hidden input for form validation */}
          <input
            type="hidden"
            {...register("category", { required: "This field is required" })}
          />

          {/* Hiển thị readonly nếu là edit */}
          {isEdit ? (
            <div className="w-full border border-gray-500 rounded-md px-4 py-2 bg-gray-300 text-gray-500">
              {selectedCategory || ""}
            </div>
          ) : (
            <>
              {/* Custom dropdown trigger */}
              <div
                className="w-full border border-gray-500 rounded-md px-4 py-2 flex justify-between items-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedCategory || ""}</span>
                <i className={`fa-solid fa-caret-${isDropdownOpen ? 'up' : 'down'}`}></i>
              </div>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                  <div className="max-h-40 overflow-y-auto">
                    {categories.map(c => (
                      <div
                        key={c.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectCategory(c.name)}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200">
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
                          <div className="flex-grow">
                            <InputField
                              placeholder="Category name"
                              value={newCategoryName}
                              onChange={e => setNewCategoryName(e.target.value)}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                          <div className="w-24">
                            <InputField
                              placeholder="Prefix"
                              value={newPrefix}
                              onChange={e => setNewPrefix(e.target.value)}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCategory();
                            }}
                            className="text-green-500 py-2.5 px-4 rounded-lg transition-colors duration-200 whitespace-nowrap"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAddCategoryForm(false);
                              setNewCategoryName('');
                              setNewPrefix('');
                              setCategoryError('');
                              setPrefixError('');
                            }}
                            className="py-2.5 px-4 rounded-lg transition-colors duration-200 whitespace-nowrap"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        {categoryError && <p className="text-red-500 mt-1">{categoryError}</p>}
                        {prefixError && <p className="text-red-500 mt-1">{prefixError}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
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
              value="available"
              {...register("state", { required: "This field is required" })}
              className="accent-[var(--primary-color)]"
            />
            Available
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="not_available"
              {...register("state", { required: "This field is required" })}
              className="accent-[var(--primary-color)]"
            />
            Not Available
          </label>
          {errors.state && <p className="text-red-500">{errors.state.message}</p>}
        </div>

        {/* Actions */}
        <div className="col-start-2 col-span-2 flex justify-end gap-4 mt-6">
          <Button text="Save" color="primary" disabled={!isValid} />
          <Button color="outline" text="Cancel" type='button' onClick={() => navigate("/manage-asset")} />
        </div>
      </form>
    </ContentWrapper>
  )
}

export default CreateUpdateAsset