import { StudentResponse, StudentInfo, InitialData } from "../types";

// Simulated "Data" sheet content
const MOCK_INITIAL_DATA: InitialData = {
  tinhXaMap: {
    "Lâm Đồng": ["Đà Lạt", "Bảo Lộc", "Đức Trọng", "Lâm Hà"],
    "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 10", "Thủ Đức"],
    "Hà Nội": ["Hoàn Kiếm", "Ba Đình", "Đống Đa", "Cầu Giấy"],
  },
  khoaLopMap: {
    "Sư phạm": ["Toán K44", "Văn K45", "Lý K46"],
    "Công nghệ Thông tin": ["CNTT K44", "CNTT K45", "CNTT K46"],
    "Kinh tế": ["QTKD K44", "Kế toán K45"],
  },
  hdKhoa: ["Hội thảo học thuật", "Giải bóng đá Khoa", "Tình nguyện hè"],
  hdDoan: ["Hiến máu nhân đạo", "Tiếp sức mùa thi", "Mùa hè xanh"],
};

// Simulated "Students" sheet content
const MOCK_STUDENTS: StudentInfo[] = [
  { mssv: "2112345", hoTen: "Nguyễn Văn A", ngaySinh: "2003-01-15", gioiTinh: "Nam", lop: "CNTT K45", khoa: "Công nghệ Thông tin" },
  { mssv: "2112346", hoTen: "Trần Thị B", ngaySinh: "2003-05-20", gioiTinh: "Nữ", lop: "Toán K44", khoa: "Sư phạm" },
  { mssv: "2112347", hoTen: "Lê Văn C", ngaySinh: "2003-11-02", gioiTinh: "Nam", lop: "QTKD K44", khoa: "Kinh tế" },
];

const STORAGE_KEY = "DLU_STUDENT_RESPONSES";

export const studentService = {
  getInitialData: async (): Promise<InitialData> => {
    return MOCK_INITIAL_DATA;
  },

  getStudentByMSSV: async (mssv: string): Promise<StudentInfo | null> => {
    return MOCK_STUDENTS.find(s => s.mssv === mssv) || null;
  },

  getResponsesList: async (): Promise<StudentResponse[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getStudentResponseByMSSV: async (mssv: string): Promise<StudentResponse | null> => {
    const list = await studentService.getResponsesList();
    return list.find(r => r.mssv === mssv) || null;
  },

  saveData: async (formData: StudentResponse): Promise<{ success: boolean; message: string }> => {
    try {
      const list = await studentService.getResponsesList();
      const index = list.findIndex(r => r.mssv === formData.mssv);
      
      const updatedData = { ...formData, timestamp: new Date().toISOString() };
      
      if (index !== -1) {
        list[index] = updatedData;
      } else {
        list.push(updatedData);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return { 
        success: true, 
        message: index !== -1 
          ? `Đã cập nhật dữ liệu thành công cho sinh viên ${formData.hoTen} - MSSV: ${formData.mssv}`
          : `Đã lưu thành công dữ liệu cho sinh viên ${formData.hoTen}` 
      };
    } catch (e) {
      return { success: false, message: String(e) };
    }
  },

  searchStudent: async (mssv: string): Promise<{ success: boolean; data?: StudentResponse; rank?: number; totalInClass?: number; message?: string }> => {
    const list = await studentService.getResponsesList();
    const student = list.find(r => r.mssv === mssv);
    
    if (!student) return { success: false, message: "Không tìm thấy kết quả rèn luyện của MSSV này!" };
    
    const classResponses = list.filter(r => r.lop === student.lop);
    const sortedScores = [...classResponses].sort((a, b) => b.tongDiem - a.tongDiem);
    const rank = sortedScores.findIndex(r => r.mssv === mssv) + 1;
    
    return {
      success: true,
      data: student,
      rank,
      totalInClass: classResponses.length
    };
  }
};
