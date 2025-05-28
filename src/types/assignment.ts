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

export interface OwnCreateAssignmentRequest {
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
  id: number,
  assetCode: string,
  assetName: string,
  assignedTo: string,
  assignedBy: string,
  assignedDate: string;
  status: string,
  canDelete: boolean
}

export interface AssignmentDetail extends Assignment {
  specification: string,
  note: string
}

export type CreateAssignmentRequest = {
  userId: number;
  assetId: number;
  assignedDate: Date;
  note: string;
};

export type CreateAssignmentResponse = {
  id: number;
  assetCode: string;
  assetName: string;
  assignedTo: string;
  assginedBy: string;
  assignedDate: string;
  state: string;
};
