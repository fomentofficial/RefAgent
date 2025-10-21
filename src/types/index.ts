export interface Notice {
  id: string;
  template_id: string;
  deceased_name: string;
  age?: number;
  death_date: string;
  funeral_hall: string;
  room_number?: string;
  burial_date: string;
  resting_place?: string;
  host_name: string;
  contact?: string;
  show_contact: boolean;
  account_bank?: string;
  account_number?: string;
  account_holder?: string;
  show_account: boolean;
  message?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoticeFormData {
  template_id: string;
  deceased_name: string;
  age?: number;
  death_date: string;
  funeral_hall: string;
  room_number?: string;
  burial_date: string;
  resting_place?: string;
  host_name: string;
  contact?: string;
  show_contact: boolean;
  account_bank?: string;
  account_number?: string;
  account_holder?: string;
  show_account: boolean;
  message?: string;
  phone: string;
  password: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface KakaoMapLocation {
  lat: number;
  lng: number;
  address: string;
}
