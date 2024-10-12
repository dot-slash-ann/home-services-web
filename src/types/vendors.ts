export interface Vendor {
  id: number;
  name: string;
}

export interface VendorsListResponse {
  data: Vendor[];
}

export interface VendorResponse {
  data: Vendor;
}
