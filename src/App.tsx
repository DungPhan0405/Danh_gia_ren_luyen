import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Search, 
  List, 
  Key, 
  LogOut, 
  Save, 
  FileSpreadsheet, 
  Edit2, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  Trophy,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { studentService } from "./services/studentService";
import { StudentResponse, InitialData } from "./types";

const CRITERIA = [
  { id: '001', text: 'Có đi học chuyên cần, đúng giờ, nghiêm túc trong giờ học.', max: 4 },
  { id: '002', text: 'Có đăng ký, thực hiện, báo cáo đề tài nghiên cứu khoa học đúng tiến độ hoặc có đăng ký, tham dự các cuộc thi học thuật cấp Khoa trở lên.', max: 2 },
  { id: '003', text: 'Có ý thức tham gia các câu lạc bộ, câu lạc bộ học thuật, các hoạt động học thuật, hoạt động ngoại khoá.', max: 2 },
  { id: '004', text: 'Bị xử lý kỷ luật trong các kỳ thi kết thúc học phần (khiển trách: -2 điểm, cảnh cáo: -4 điểm, đình chỉ thi: -6 điểm).', max: 0, min: -6 },
  { id: '005', text: 'Được tập thể lớp công nhận có tinh thần vượt khó, phấn đấu vươn lên trong học tập.', max: 2 },
  { id: '006', text: 'Kết quả học tập (Yếu kém: 0 điểm; Trung bình: 4 điểm; Khá: 6 điểm; Giỏi: 8 điểm; Xuất sắc: 10 điểm).', max: 10 },
  { id: '007', text: 'Có ý thức chấp hành các văn bản chỉ đạo của ngành, của trường được thực hiện trong nhà trường.', max: 6 },
  { id: '008', text: 'Có ý thức tham gia đầy đủ, đạt yêu cầu các cuộc vận động, sinh hoạt chính trị theo chủ trương, của cấp trên và nhà trường.', max: 4 },
  { id: '009', text: 'Có ý thức chấp hành nội quy, quy chế, thực hiện nội quy văn hóa học đường và các quy định của nhà trường.', max: 10 },
  { id: '010', text: 'Tham gia đầy đủ, đạt yêu cầu “Tuần sinh hoạt công dân sinh viên”.', max: 5 },
  { id: '011', text: 'Tham gia các hoạt động, sinh hoạt phong trào, tình nguyện do Khoa tổ chức.', max: 6, isCheckbox: true, type: 'khoa' },
  { id: '012', text: 'Tham gia các hoạt động do Đoàn thanh niên và Hội sinh viên tổ chức.', max: 6, isCheckbox: true, type: 'doan' },
  { id: '013', text: 'Có ý thức tham gia đầy đủ, nghiêm túc hoạt động rèn luyện về chính trị, xã hội, văn hóa, văn nghệ, thể thao do nhà trường tổ chức.', max: 4 },
  { id: '014', text: 'Có ý thức tham gia các hoạt động công ích, tình nguyện, công tác xã hội trong nhà trường.', max: 2 },
  { id: '015', text: 'Có ý thức tham gia các hoạt động tuyên truyền, phòng chống tội phạm và các tệ nạn xã hội trong nhà trường.', max: 2 },
  { id: '016', text: 'Có ý thức chấp hành, tham gia tuyên truyền các chủ trương của Đảng, chính sách, pháp luật của Nhà nước.', max: 4 },
  { id: '017', text: 'Có tham gia bảo hiểm y tế (bắt buộc) theo Luật bảo hiểm y tế.', max: 10 },
  { id: '018', text: 'Có ý thức chấp hành, tham gia tuyên truyền các quy định về bảo đảm an toàn giao thông và “văn hóa giao thông”.', max: 5 },
  { id: '019', text: 'Có ý thức tham gia các hoạt động xã hội có thành tích được ghi nhận, biểu dương, khen thưởng.', max: 4 },
  { id: '020', text: 'Có tinh thần chia sẻ, giúp đỡ người gặp khó khăn, hoạn nạn.', max: 2 },
  { id: '021', text: 'Có ý thức, uy tín và hoàn thành tốt nhiệm vụ quản lý lớp, các tổ chức Đảng, Đoàn Thanh niên, Hội Sinh viên.', max: 3 },
  { id: '022', text: 'Có kỹ năng tổ chức, quản lý lớp, các tổ chức Đảng, Đoàn Thanh niên, Hội Sinh viên.', max: 2 },
  { id: '023', text: 'Hỗ trợ và tham gia tích cực các hoạt động chung của tập thể lớp, khoa, trường.', max: 3 },
  { id: '024', text: 'Đạt thành tích trong học tập, rèn luyện (được tặng bằng khen, giấy khen, chứng nhận).', max: 2 }
];

const SECTIONS = [
  { start: '001', no: '1', text: 'Đánh giá về ý thức tham gia học tập', max: 20 },
  { start: '007', no: '2', text: 'Đánh giá về ý thức chấp hành nội quy, quy chế, quy định trong nhà trường', max: 25 },
  { start: '011', no: '3', text: 'Đánh giá về ý thức và kết quả tham gia các hoạt động chính trị - xã hội, văn hóa, văn nghệ, thể thao.', max: 20 },
  { start: '016', no: '4', text: 'Đánh giá về ý thức công dân trong quan hệ cộng đồng', max: 25 },
  { start: '021', no: '5', text: 'Đánh giá về ý thức và kết quả tham gia công tác cán bộ lớp, các đoàn thể.', max: 10 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("input");
  const [initialData, setInitialData] = useState<InitialData | null>(null);
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMssv, setSearchMssv] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const emptyForm: StudentResponse = {
    timestamp: "",
    mssv: "",
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    lop: "",
    khoa: "",
    tinhTP: "",
    xaPhuong: "",
    diaChi: "",
    sdt: "",
    scores: CRITERIA.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {}),
    hdKhoaSelected: "",
    hdDoanSelected: "",
    tongDiem: 0,
    xepLoai: "Kém"
  };

  const [formData, setFormData] = useState<StudentResponse>(emptyForm);

  useEffect(() => {
    studentService.getInitialData().then(setInitialData);
    refreshResponses();
  }, []);

  const refreshResponses = async () => {
    const data = await studentService.getResponsesList();
    setResponses(data);
  };

  const calculateTotal = (scores: Record<string, number>) => {
    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    const clampedTotal = Math.max(0, Math.min(100, total));
    
    let rank = "Kém";
    if (clampedTotal >= 90) rank = "Xuất sắc";
    else if (clampedTotal >= 80) rank = "Tốt";
    else if (clampedTotal >= 70) rank = "Khá";
    else if (clampedTotal >= 60) rank = "Trung bình";
    else if (clampedTotal >= 50) rank = "Yếu";

    return { total: clampedTotal, rank };
  };

  const handleScoreChange = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    const criteria = CRITERIA.find(c => c.id === id);
    if (!criteria) return;

    const min = criteria.min ?? 0;
    const max = criteria.max;
    const clamped = Math.max(min, Math.min(max, num));

    const newScores = { ...formData.scores, [id]: clamped };
    const { total, rank } = calculateTotal(newScores);
    
    setFormData({
      ...formData,
      scores: newScores,
      tongDiem: total,
      xepLoai: rank
    });
  };

  const handleCheckboxChange = (type: 'khoa' | 'doan', value: string, checked: boolean) => {
    const currentSelected = type === 'khoa' ? formData.hdKhoaSelected : formData.hdDoanSelected;
    let selectedArr = currentSelected ? currentSelected.split(" | ") : [];
    
    if (checked) {
      selectedArr.push(value);
    } else {
      selectedArr = selectedArr.filter(v => v !== value);
    }

    const newStr = selectedArr.join(" | ");
    const criteriaId = type === 'khoa' ? '011' : '012';
    const criteria = CRITERIA.find(c => c.id === criteriaId)!;
    const newScore = Math.min(selectedArr.length * 2, criteria.max);

    const newScores = { ...formData.scores, [criteriaId]: newScore };
    const { total, rank } = calculateTotal(newScores);

    setFormData({
      ...formData,
      [type === 'khoa' ? 'hdKhoaSelected' : 'hdDoanSelected']: newStr,
      scores: newScores,
      tongDiem: total,
      xepLoai: rank
    });
  };

  const handleSave = async () => {
    if (!formData.mssv || !formData.hoTen) {
      alert("Vui lòng nhập đầy đủ MSSV và Họ tên!");
      return;
    }
    setLoading(true);
    const res = await studentService.saveData(formData);
    setLoading(false);
    if (res.success) {
      alert(res.message);
      refreshResponses();
    } else {
      alert("Lỗi: " + res.message);
    }
  };

  const handleSearch = async () => {
    if (!searchMssv) return;
    setLoading(true);
    const res = await studentService.searchStudent(searchMssv);
    setLoading(false);
    if (res.success) {
      setSearchResult(res);
    } else {
      alert(res.message);
      setSearchResult(null);
    }
  };

  const handleEdit = async (mssv: string) => {
    setLoading(true);
    // Fetch fresh data from "sheet" (localStorage)
    const freshData = await studentService.getStudentResponseByMSSV(mssv);
    setLoading(false);

    if (freshData) {
      setFormData(freshData);
      setActiveTab("input");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If not in responses, try students list for basic info
      const basicInfo = await studentService.getStudentByMSSV(mssv);
      if (basicInfo) {
        setFormData({
          ...emptyForm,
          ...basicInfo,
        });
        setActiveTab("input");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("Không tìm thấy dữ liệu sinh viên!");
      }
    }
  };

  const stats = useMemo(() => {
    const total = responses.length;
    const done = responses.filter(r => r.tongDiem > 0).length;
    return { total, done, pending: total - done };
  }, [responses]);

  return (
    <div className="min-h-screen bg-[#f4f6f9] pb-10">
      {/* Header */}
      <header className="bg-white border-b-4 border-[#003366] py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <img 
            src="https://dlu.edu.vn/wp-content/uploads/2025/07/00.-Newest_DLU-Logo-1-1536x1536.png" 
            alt="DLU Logo" 
            className="h-20 w-20 object-contain"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#003366] tracking-tight">TRƯỜNG ĐẠI HỌC ĐÀ LẠT</h1>
            <p className="text-gray-600 font-medium uppercase tracking-wider text-sm md:text-base">Hệ thống đánh giá kết quả rèn luyện</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6">
          {[
            { id: "input", label: "NHẬP ĐIỂM", icon: Edit2 },
            { id: "lookup", label: "TRA CỨU", icon: Search },
            { id: "management", label: "QUẢN LÝ", icon: List },
            { id: "password", label: "ĐỔI MẬT KHẨU", icon: Key },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all rounded-t-lg ${
                activeTab === tab.id 
                ? "bg-[#003366] text-white shadow-md" 
                : "bg-white text-[#003366] hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-2 px-6 py-3 font-bold text-sm bg-red-600 text-white rounded-t-lg hover:bg-red-700 transition-colors">
            <LogOut size={18} />
            ĐĂNG XUẤT
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Input Tab */}
          {activeTab === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Personal Info Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-[#003366] text-white px-6 py-3 font-bold flex items-center gap-2">
                  <User size={20} />
                  1. THÔNG TIN CÁ NHÂN
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">MSSV (*)</label>
                    <input 
                      type="text" 
                      value={formData.mssv}
                      onChange={(e) => setFormData({ ...formData, mssv: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                      placeholder="Nhập MSSV"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Họ và tên (*)</label>
                    <input 
                      type="text" 
                      value={formData.hoTen}
                      onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                      placeholder="Họ và tên"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Ngày sinh</label>
                    <input 
                      type="date" 
                      value={formData.ngaySinh}
                      onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Giới tính</label>
                    <select 
                      value={formData.gioiTinh}
                      onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Khoa</label>
                    <select 
                      value={formData.khoa}
                      onChange={(e) => setFormData({ ...formData, khoa: e.target.value, lop: "" })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                    >
                      <option value="">-- Chọn Khoa --</option>
                      {initialData && Object.keys(initialData.khoaLopMap).map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Lớp</label>
                    <select 
                      value={formData.lop}
                      onChange={(e) => setFormData({ ...formData, lop: e.target.value })}
                      disabled={!formData.khoa}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all disabled:bg-gray-50"
                    >
                      <option value="">-- Chọn Lớp --</option>
                      {initialData && formData.khoa && initialData.khoaLopMap[formData.khoa]?.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Criteria Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-[#003366] text-white px-6 py-3 font-bold flex items-center gap-2">
                  <FileSpreadsheet size={20} />
                  2. BẢNG ĐIỂM ĐÁNH GIÁ CHI TIẾT
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-[#003366] font-bold border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-center w-16">STT</th>
                        <th className="px-4 py-3 text-left">Nội dung đánh giá</th>
                        <th className="px-4 py-3 text-center w-24">Tối đa</th>
                        <th className="px-4 py-3 text-center w-32">Tự đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {CRITERIA.map((item) => {
                        const section = SECTIONS.find(s => s.start === item.id);
                        return (
                          <React.Fragment key={item.id}>
                            {section && (
                              <tr className="bg-blue-50/50">
                                <td className="px-4 py-3 text-center font-bold text-[#003366]">{section.no}</td>
                                <td className="px-4 py-3 font-bold text-[#003366]">{section.text}</td>
                                <td className="px-4 py-3 text-center font-bold text-red-600">{section.max}</td>
                                <td className="px-4 py-3"></td>
                              </tr>
                            )}
                            <tr className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-4 text-center text-gray-500 font-medium">{item.id}</td>
                              <td className="px-4 py-4 text-gray-700">
                                {item.text}
                                {item.isCheckbox && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                                    {initialData && (item.type === 'khoa' ? initialData.hdKhoa : initialData.hdDoan).map((hd, idx) => (
                                      <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                          type="checkbox" 
                                          checked={(item.type === 'khoa' ? formData.hdKhoaSelected : formData.hdDoanSelected).includes(hd)}
                                          onChange={(e) => handleCheckboxChange(item.type as 'khoa' | 'doan', hd, e.target.checked)}
                                          className="w-4 h-4 text-[#003366] rounded focus:ring-[#003366]"
                                        />
                                        <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">{hd}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4 text-center font-bold text-orange-600">{item.max}</td>
                              <td className="px-4 py-4">
                                <input 
                                  type="number" 
                                  value={formData.scores[item.id]}
                                  onChange={(e) => handleScoreChange(item.id, e.target.value)}
                                  readOnly={item.isCheckbox}
                                  className={`w-20 mx-auto block px-2 py-1.5 text-center font-bold border rounded-lg focus:ring-2 focus:ring-[#003366] outline-none transition-all ${
                                    item.isCheckbox ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                  }`}
                                />
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary & Actions */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-wrap justify-between items-center gap-6 sticky bottom-4 z-10">
                <div className="flex items-center gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tổng điểm đánh giá</p>
                    <h3 className="text-3xl font-black text-red-600 leading-none">
                      {formData.tongDiem}<span className="text-lg text-gray-400 font-normal">/100</span>
                    </h3>
                  </div>
                  <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                  <div className="text-center md:text-left">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Xếp loại dự kiến</p>
                    <h3 className={`text-xl font-bold leading-none ${
                      formData.xepLoai === "Xuất sắc" ? "text-purple-600" :
                      formData.xepLoai === "Tốt" ? "text-green-600" :
                      formData.xepLoai === "Khá" ? "text-blue-600" :
                      formData.xepLoai === "Trung bình" ? "text-orange-600" : "text-red-600"
                    }`}>
                      {formData.xepLoai}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                    LƯU KẾT QUẢ
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg active:scale-95">
                    <FileSpreadsheet size={20} />
                    XUẤT EXCEL
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lookup Tab */}
          {activeTab === "lookup" && (
            <motion.div
              key="lookup"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                <h2 className="text-2xl font-bold text-[#003366] mb-6">TRA CỨU KẾT QUẢ RÈN LUYỆN</h2>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={searchMssv}
                    onChange={(e) => setSearchMssv(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Nhập MSSV để tra cứu..."
                    className="flex-1 px-6 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#003366] outline-none transition-all text-lg font-medium"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-8 py-4 bg-[#003366] text-white font-bold rounded-2xl hover:bg-[#002244] transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                    TRA CỨU
                  </button>
                </div>
              </div>

              {searchResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-[#003366] px-8 py-4 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <GraduationCap size={20} />
                      KẾT QUẢ ĐÁNH GIÁ
                    </h3>
                    <button 
                      onClick={() => handleEdit(searchResult.data.mssv)}
                      className="px-4 py-1.5 bg-yellow-400 text-[#003366] font-bold text-xs rounded-full hover:bg-yellow-500 transition-all flex items-center gap-1"
                    >
                      <Edit2 size={14} />
                      CHỈNH SỬA
                    </button>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8 mb-8">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Họ và tên</p>
                          <p className="text-xl font-bold text-gray-800">{searchResult.data.hoTen}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">MSSV</p>
                            <p className="font-bold text-gray-700">{searchResult.data.mssv}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Ngày sinh</p>
                            <p className="font-bold text-gray-700">{searchResult.data.ngaySinh}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Lớp / Khoa</p>
                          <p className="font-bold text-gray-700">{searchResult.data.lop} - {searchResult.data.khoa}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                        <div className="mb-4">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tổng điểm rèn luyện</p>
                          <h4 className="text-5xl font-black text-red-600 leading-none">{searchResult.data.tongDiem}</h4>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Xếp loại</p>
                          <h4 className={`text-2xl font-bold ${
                            searchResult.data.xepLoai === "Xuất sắc" ? "text-purple-600" :
                            searchResult.data.xepLoai === "Tốt" ? "text-green-600" :
                            searchResult.data.xepLoai === "Khá" ? "text-blue-600" :
                            searchResult.data.xepLoai === "Trung bình" ? "text-orange-600" : "text-red-600"
                          }`}>{searchResult.data.xepLoai}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-[#003366] font-bold">
                          <Trophy size={18} className="text-yellow-500" />
                          <span>HẠNG: {searchResult.rank} / {searchResult.totalInClass}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-gray-400 text-xs italic">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        Cập nhật lần cuối: {new Date(searchResult.data.timestamp).toLocaleString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle size={14} className="text-green-500" />
                        Dữ liệu đã xác thực
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Management Tab */}
          {activeTab === "management" && (
            <motion.div
              key="management"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-600 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Tổng sinh viên</p>
                    <h3 className="text-3xl font-black text-blue-900">{stats.total}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <GraduationCap size={24} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-600 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Đã đánh giá</p>
                    <h3 className="text-3xl font-black text-green-900">{stats.done}</h3>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <CheckCircle size={24} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-600 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Chưa đánh giá</p>
                    <h3 className="text-3xl font-black text-orange-900">{stats.pending}</h3>
                  </div>
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <AlertCircle size={24} />
                  </div>
                </div>
              </div>

              {/* Responses Table */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-[#003366] px-6 py-4 flex justify-between items-center">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <List size={20} />
                    DANH SÁCH SINH VIÊN ĐÃ NỘP (RESPONSES)
                  </h3>
                  <button 
                    onClick={refreshResponses}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-[#003366] font-bold border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-4 text-center">MSSV</th>
                        <th className="px-4 py-4 text-left">Họ và tên</th>
                        <th className="px-4 py-4 text-center">Ngày sinh</th>
                        <th className="px-4 py-4 text-center">Giới tính</th>
                        <th className="px-4 py-4 text-center">Lớp</th>
                        <th className="px-4 py-4 text-center">Khoa</th>
                        <th className="px-4 py-4 text-center">Tổng điểm</th>
                        <th className="px-4 py-4 text-center">Xếp loại</th>
                        <th className="px-4 py-4 text-center">Thời gian nộp</th>
                        <th className="px-4 py-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {responses.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-4 py-10 text-center text-gray-400 italic">
                            Chưa có dữ liệu sinh viên nộp bài.
                          </td>
                        </tr>
                      ) : (
                        responses.map((res) => (
                          <tr key={res.mssv} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 text-center font-bold text-[#003366]">{res.mssv}</td>
                            <td className="px-4 py-4 font-medium text-gray-800">{res.hoTen}</td>
                            <td className="px-4 py-4 text-center text-gray-600">{res.ngaySinh}</td>
                            <td className="px-4 py-4 text-center text-gray-600">{res.gioiTinh}</td>
                            <td className="px-4 py-4 text-center text-gray-600">{res.lop}</td>
                            <td className="px-4 py-4 text-center text-gray-600">{res.khoa}</td>
                            <td className="px-4 py-4 text-center font-bold text-red-600">{res.tongDiem}</td>
                            <td className="px-4 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                res.xepLoai === "Xuất sắc" ? "bg-purple-100 text-purple-700" :
                                res.xepLoai === "Tốt" ? "bg-green-100 text-green-700" :
                                res.xepLoai === "Khá" ? "bg-blue-100 text-blue-700" :
                                res.xepLoai === "Trung bình" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                              }`}>
                                {res.xepLoai}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center text-gray-400 text-[10px]">
                              {new Date(res.timestamp).toLocaleString('vi-VN')}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button 
                                onClick={() => handleEdit(res.mssv)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Chỉnh sửa (Lấy dữ liệu từ Sheet)"
                              >
                                <Edit2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-[#003366] px-8 py-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Key size={20} />
                    THAY ĐỔI MẬT KHẨU
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <button className="w-full py-4 bg-yellow-400 text-[#003366] font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg active:scale-95">
                    LƯU THAY ĐỔI
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm">
        <p>© 2026 Trường Đại học Đà Lạt - Hệ thống Đánh giá Rèn luyện</p>
        <p className="mt-1">Phát triển bởi Phòng Công tác Sinh viên</p>
      </footer>
    </div>
  );
}
