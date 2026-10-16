export interface TrainingLevel {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface ProvinceDetails {
  id: string;
  name: string;
  districts: District[];
}

export interface ProvincePage {
  content: Province[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
