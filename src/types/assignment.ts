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
