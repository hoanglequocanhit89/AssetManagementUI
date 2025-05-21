import React, { useEffect, useState } from 'react';
import ContentWrapper from '../../../components/ui/content-wrapper';
import InputField from '../../../components/ui/input';
import DateFilter from '../../../components/ui/date-filter';
import Button from '../../../components/ui/button';
import Select from '../../../components/ui/select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { differenceInYears, isAfter } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import userApi from '../../../api/userApi';
import { format } from 'date-fns';

type FormFields = {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: 'MALE' | 'FEMALE';
  joinedDate: Date;
  type: 'ADMIN' | 'STAFF';
  location?: string;
};

const locationOptions = [
  { value: 'HCM', label: 'Ho Chi Minh' },
  { value: 'DN', label: 'Da Nang' },
  { value: 'HN', label: 'Ha Noi' },
];

const typeOptions = [
  { value: 'STAFF', label: 'Staff' },
  { value: 'ADMIN', label: 'Admin' },
];

const CreateUpdateUser: React.FC = () => {
  const { id } = useParams();
  const [staffCode, setStaffCode] = useState("");
  const [username, setUsername] = useState("");
  const isEdit = !!id;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    setValue,
    setError,
    getValues,
    trigger
  } = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      type: 'STAFF',
      location: 'HCM',
    }
  });

  const watchDOB = watch("dob");
  const watchUserType = watch("type");

  useEffect(() => {
    const fetchUser = async () => {
      if (isEdit) {
        const response = await userApi.getDetailUser(Number(id));
        const user = response.data;
        if (user) {
          setValue("firstName", user.firstName);
          setValue("lastName", user.lastName);
          setValue("dob", new Date(user.dob));
          setValue("gender", user.gender as "MALE" | "FEMALE");
          setValue("joinedDate", new Date(user.joinedDate));
          setValue("type", user.role as "ADMIN" | "STAFF");
          setValue("location", user.location);
          setStaffCode(user.staffCode);
          setUsername(user.username);
          trigger();
        }
      }
    };
    fetchUser();
  }, [id, isEdit, setValue, trigger]);

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    const { firstName, lastName } = getValues();

    let hasError = false;

    if (!firstName?.trim()) {
      setError("firstName", { type: "manual", message: "This field is required" });
      hasError = true;
    }

    if (!lastName?.trim()) {
      setError("lastName", { type: "manual", message: "This field is required" });
      hasError = true;
    }

    if (hasError) return;

    try {
      if (isEdit) {
        await userApi.updateUser(Number(id), {
          ...data,
          dob: format(data.dob, 'yyyy-MM-dd'),
          joinedDate: format(data.joinedDate, 'yyyy-MM-dd'),
          role: data.type
        });
        toast.success("Updated successfully");
        navigate("/manage-user", {
          state: {
            tempUser: {
              ...data,
              username,
              staffCode,
              fullName: `${data.firstName} ${data.lastName}`,
              joinedDate: format(data.joinedDate, 'yyyy-MM-dd'),
              role: data.type
            }
          }
        });
      }
      else {
        const response = await userApi.createUser({
          ...data,
          dob: format(data.dob, 'yyyy-MM-dd'),
          joinedDate: format(data.joinedDate, 'yyyy-MM-dd')
        });
        const newUser = response.data;
        toast.success("User created successfully");
        navigate("/manage-user", {
          state: {
            tempUser: {
              ...data,
              ...newUser,
              id: 3
            }
          }
        });
      }
    }
    catch (error) {
      console.log(error);
      toast.error(`Failed to ${isEdit ? "edit" : "create"} user`);
    }

  };

  return (
    <ContentWrapper title={id ? 'Edit User' : 'Create New User'}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-y-6 items-start text-[1.6rem] max-w-3xl">
        {/* First Name */}
        <label htmlFor="firstName" className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">First Name</label>
        <div className="col-span-2">
          <InputField
            id="firstName"
            disabled={isEdit}
            {...register("firstName", {
              required: "This field is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters and spaces are allowed"
              },
              maxLength: {
                value: 128,
                message: "Maximum 128 characters allowed"
              }
            })}
            value={watch("firstName") || ""}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^[A-Za-z\s]*$/.test(value);
              if (value.length <= 128 && isValid) {
                setValue("firstName", value, { shouldValidate: true });
              }
            }}
          />
        </div>
        {errors.firstName && <p className='col-span-3 text-red-500 text-center -mt-6 -ml-6'>{errors.firstName.message}</p>}


        {/* Last Name */}
        <label htmlFor="lastName" className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Last Name</label>
        <div className="col-span-2">
          <InputField
            id="lastName"
            disabled={isEdit}
            {...register("lastName", {
              required: "This field is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Only letters and spaces are allowed"
              },
              maxLength: {
                value: 128,
                message: "Maximum 128 characters allowed"
              }
            })}
            value={watch("lastName") || ""}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^[A-Za-z\s]*$/.test(value);
              if (value.length <= 128 && isValid) {
                setValue("lastName", value, { shouldValidate: true });
              }
            }}
          />
        </div>
        {errors.lastName && (
          <>
            <div className='col-span-1'></div>
            <p className='col-span-2 text-red-500 -mt-6'>{errors.lastName.message}</p>
          </>
        )}



        {/* Date of Birth */}
        <label className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Date of Birth</label>
        <div className="col-span-2">
          <Controller
            control={control}
            name="dob"
            rules={{
              required: "This field is required",
              validate: (value) =>
                differenceInYears(new Date(), value) >= 18 || "User is under 18. Please select a different date"
            }}
            render={({ field }) => (
              <DateFilter label="" selectedDate={field.value} onSelect={field.onChange} isHighlight={!!errors.dob} />
            )}
          />
          {errors.dob && <p className='text-red-500'>{errors.dob.message}</p>}
        </div>

        {/* Gender */}
        <label className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Gender</label>
        <div className="col-span-2 flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="FEMALE"
              {...register("gender", { required: "This field is required" })}
              className='accent-[var(--primary-color)]'
            />
            Female
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="MALE"
              {...register("gender", { required: "This field is required" })}
              className='accent-[var(--primary-color)]'
            />
            Male
          </label>
        </div>
        {errors.gender && <p className='text-red-500 col-span-3 text-center -mt-6 -ml-6'>{errors.gender.message}</p>}

        {/* Joined Date */}
        <label className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Joined Date</label>
        <div className="col-span-2">
          <Controller
            control={control}
            name="joinedDate"
            rules={{
              required: "This field is required",
              validate: (value) => {
                if (!watchDOB || !isAfter(value, watchDOB)) {
                  return "Joined date is not later than Date of Birth. Please select a different date";
                }
                const day = new Date(value).getDay(); // 0: Sunday, 6: Saturday
                if (day === 0 || day === 6) {
                  return "Joined date is Saturday or Sunday. Please select a different date";
                }
                return true;
              }
            }}
            render={({ field }) => (
              <DateFilter label="" selectedDate={field.value} onSelect={field.onChange} isHighlight={!!errors.joinedDate} />
            )}
          />
          {errors.joinedDate && <p className='text-red-500'>{errors.joinedDate.message}</p>}
        </div>

        {/* Type */}
        <label className="pr-4 after:content-['*'] after:text-red-500 after:ml-2">Type</label>
        <div className="col-span-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                }}
                options={typeOptions}
              />
            )}
          />
        </div>

        {/* Location (only for admin) */}
        {watchUserType === "ADMIN" && !isEdit && (
          <>
            <label className='pr-4'>Location</label>
            <div className="col-span-2">
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    options={locationOptions}
                  />
                )}
              />
            </div>
          </>
        )}

        {/* Actions */}
        <div className="col-start-2 col-span-2 flex justify-end gap-4 mt-6">
          <Button text='Save' color="primary" disabled={!isValid} />
          <Button color="outline" text='Cancel' type='button' onClick={() => navigate("/manage-user")} />
        </div>
      </form>
    </ContentWrapper>
  );
};

export default CreateUpdateUser;
