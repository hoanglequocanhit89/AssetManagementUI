import { Asset, AssetDetail, Category, CreateAssetRequest, EditAssetRequest, EditAssetResponse } from '../types/asset';
import { BaseResponse, BaseParams, BaseResponseWithoutPagination } from './../types/common';
import axiosClients from './axiosClients';

interface AssetParams {
  locationId: number,
  keyword: string,
  categoryName: string,
  states: string,
  params: BaseParams
}

const assetApi = {
  getAssetList(props: AssetParams): Promise<BaseResponse<Asset>> {

    const { locationId, keyword, categoryName, states, params } = props;

    const url = `assets?locationId=${locationId}&keyword=${keyword}&categoryName=${categoryName}&states=${states}`;

    return axiosClients.get(url, { params: params });
  },

  getAssetDetail(assetId: number): Promise<BaseResponseWithoutPagination<AssetDetail>> {

    const url = `assets/${assetId}`;

    return axiosClients.get(url);
  },

  getCategoryList(): Promise<BaseResponseWithoutPagination<Category[]>> {

    const url = 'categories'

    return axiosClients.get(url);
  },

  createAsset(adminId: number, request: CreateAssetRequest): Promise<BaseResponseWithoutPagination<Asset>> {
    return axiosClients.post("assets", request, {
      params: {
        adminId
      }
    });
  },

  editAsset(adminId: number, assetId: number, data: EditAssetRequest): Promise<BaseResponseWithoutPagination<EditAssetResponse>> {
    return axiosClients.put(`assets/${assetId}`, data, {
      params: {
        adminId
      }
    })
  },
  
    deleteAsset(assetId: number): Promise<BaseResponseWithoutPagination<string>> {
        const url = `assets/${assetId}`;
        return axiosClients.delete(url);
    },
}

export default assetApi;