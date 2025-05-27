export interface Assignment {
  id: number;
  assetCode: string;
  assetName: string;
  category: string;
  assignedDate: string;
  status: string;
}

export interface AssignmentDetail extends Assignment {
  specification: string;
  assignedTo: string;
  assignedBy: string;
  note: string;
}

export interface AssignmentFilterRequest {
  query: string;
  status: string;
}

export interface CreateAssignmentRequest {
  assetId: number;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
}

export interface UpdateAssignmentRequest {
  assetId: number;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
  status: string;
}
