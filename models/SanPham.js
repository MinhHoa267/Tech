import mongoose from "mongoose"; //  Mongoose để định nghĩa cấu trúc tài liệu.

// Mô tả các trường của một sản phẩm trong collection sanphams.
const cauTrucSanPham = new mongoose.Schema({ // Tạo schema cho sản phẩm.
  ten: { type: String, required: true, trim: true }, // Tên sản phẩm là bắt buộc.
  thuongHieu: { type: String, required: true, trim: true }, // Thương hiệu sản phẩm.
  danhMuc: { type: String, required: true, trim: true }, // Danh mục như Laptop hoặc Phụ kiện.
  gia: { type: Number, required: true, min: 0 }, // Giá bán không được âm.
  moTa: { type: String, default: "" }, // Mô tả ngắn, mặc định rỗng.
  hinhAnh: { type: String, default: "🔌" }, // Dùng emoji làm ảnh minh họa, không cần dịch vụ ảnh.
  soLuong: { type: Number, default: 10, min: 0 }, // Số lượng tồn kho.
  noiBat: { type: Boolean, default: false }, // Đánh dấu sản phẩm nổi bật.
  ngayTao: { type: Date, default: Date.now } // Tự lưu thời điểm tạo sản phẩm.
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt.

// Tạo index cho tên sản phẩm để minh họa lập chỉ mục.
cauTrucSanPham.index({ ten: 1 }); // Index tăng dần hỗ trợ tìm kiếm theo tên.

// Tái sử dụng model nếu Next.js đã biên dịch model trước đó.
const SanPham = mongoose.models.SanPham || mongoose.model("SanPham", cauTrucSanPham); // Tránh lỗi khai báo model trùng.
export default SanPham; // Xuất model để API dùng.
