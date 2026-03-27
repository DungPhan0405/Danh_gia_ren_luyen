export interface StudentResponse {
  timestamp: string;
  mssv: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  lop: string;
  khoa: string;
  tinhTP: string;
  xaPhuong: string;
  diaChi: string;
  sdt: string;
  scores: Record<string, number>; // diem_001 to diem_024
  hdKhoaSelected: string;
  hdDoanSelected: string;
  tongDiem: number;
  xepLoai: string;
}

export interface StudentInfo {
  mssv: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  lop: string;
  khoa: string;
}

export interface InitialData {
  tinhXaMap: Record<string, string[]>;
  khoaLopMap: Record<string, string[]>;
  hdKhoa: string[];
  hdDoan: string[];
}
