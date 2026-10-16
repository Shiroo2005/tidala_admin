export interface IGoongAutoCompleteAddress {
  description: string;
  place_id: string;
  distance_meters?: number;
  compound?: {
    province?: string;
    district?: string;
    commune?: string;
  };
  deprecated_compound?: {
    province?: string;
    district?: string;
    commune?: string;
  };
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface IGoongAutocompleteResponse {
  status: string;
  predictions: IGoongAutoCompleteAddress[];
}
