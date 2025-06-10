import {
  Asset,
  AssetBrief,
  AssetDetail,
  Category,
  CreateAssetRequest,
  EditAssetRequest,
  EditAssetResponse,
  getAllAssetsParams,
} from "../types/asset";
import { BaseResponse, BaseParams, BaseResponseWithoutPagination } from "./../types/common";
import axiosClients from "./axiosClients";

interface AssetParams {
  locationId: number;
  keyword: string;
  categoryName: string;
  states: string;
  params: BaseParams;
}

const assetApi = {
  getAssetList(props: AssetParams): Promise<BaseResponse<Asset>> {
    const { keyword, categoryName, states, params } = props;

    //buil params

    const searchParams = new URLSearchParams();

    if (keyword) {
      searchParams.append("keyword", keyword);
    }
    if (categoryName) {
      searchParams.append("categoryName", categoryName);
    }
    if (states) {
      searchParams.append("states", states);
    }

    if (params) {
      searchParams.append("sortBy", params.sortBy);
      searchParams.append("sortDir", params.sortDir);
      searchParams.append("size", params.size.toString());
      searchParams.append("page", params.page.toString());
    }

    return axiosClients.get("assets", { params: searchParams });
  },

  getAssetDetail(assetId: number): Promise<BaseResponseWithoutPagination<AssetDetail>> {
    const url = `assets/${assetId}`;

    return axiosClients.get(url);
  },

  getCategoryList(): Promise<BaseResponseWithoutPagination<Category[]>> {
    const url = "categories";

    return axiosClients.get(url);
  },

  createAsset(
    adminId: number,
    request: CreateAssetRequest
  ): Promise<BaseResponseWithoutPagination<Asset>> {
    return axiosClients.post("assets", request, {
      params: {
        adminId,
      },
    });
  },

  editAsset(
    adminId: number,
    assetId: number,
    data: EditAssetRequest
  ): Promise<BaseResponseWithoutPagination<EditAssetResponse>> {
    return axiosClients.put(`assets/${assetId}`, data, {
      params: {
        adminId,
      },
    });
  },

  deleteAsset(assetId: number): Promise<BaseResponseWithoutPagination<string>> {
    const url = `assets/${assetId}`;
    return axiosClients.delete(url);
  },

  getAllAssets(params?: getAllAssetsParams): Promise<BaseResponseWithoutPagination<AssetBrief[]>> {
    const url = "assets/all/brief";
    return axiosClients.get(url, { params });
  }
};

export default assetApi;
