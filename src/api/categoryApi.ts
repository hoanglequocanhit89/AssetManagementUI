import { BaseResponseWithoutPagination } from "../types";
import { Category, CategoryListResponse, CreateCategoryRequest } from "../types/category";
import axiosClients from "./axiosClients";

const categoryApi = {
  getCategoryList(): Promise<BaseResponseWithoutPagination<CategoryListResponse[]>> {
    return axiosClients.get("categories");
  },

  createCategory(request: CreateCategoryRequest): Promise<BaseResponseWithoutPagination<Category>> {
    return axiosClients.post("categories", request);
  }


}

export default categoryApi;