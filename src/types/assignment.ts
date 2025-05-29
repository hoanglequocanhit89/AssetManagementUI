import { AssetBrief } from "./asset";
import { UserBrief } from "./user";

export interface OwnAssignment {
  id: number;
  assetCode: string;
  assetName: string;
  category: string;
  assignedDate: string;
  status: string;
}

export interface OwnAssignmentDetail extends OwnAssignment {
  specification: string;
  assignedTo: string;
  assignedBy: string;
  note: string;
}

export interface OwnAssignmentFilterRequest {
  query: string;
  status: string;
}

export interface OwnCreateUpdateAssignmentRequest {
  assetId: number;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
}

export interface OwnUpdateAssignmentRequest {
  assetId: number;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
  status: string;
}

export interface Assignment {
  id: number;
  assetCode: string;
  assetName: string;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
  status: string;
  canDelete: boolean;
}

export interface AssignmentDetail extends Assignment {
  specification: string;
  note: string;
}

export type CreateUpdateAssignmentRequest = {
  userId: number;
  assetId: number;
  assignedDate: Date;
  note: string;
};

export type CreateUpdateAssignmentResponse = {
  id: number;
  assetCode: string;
  assetName: string;
  assignedTo: string;
  assginedBy: string;
  assignedDate: string;
  state: string;
};

export type AssignmentToUpdate = {
  user: UserBrief;
  asset: AssetBrief;
  assignedDate: Date;
  note: string;
};
