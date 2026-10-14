require("dotenv").config({ path: ".env.local" }); //  biến môi trường từ file .env.local.
const mongoose = require("mongoose"); //  Mongoose trong script Node.js độc lập.

// Dữ liệu mẫu cho cửa hàng
const duLieuMau = [ //  danh sách document.
  { ten: "Laptop Air 14", thuongHieu: "Nova", danhMuc: "Laptop", gia: 18990000, moTa: "Nhẹ, gọn cho học tập và làm việc.", hinhAnh: "💻", soLuong: 8, noiBat: true }, // Laptop.
  { ten: "Điện thoại Nova X", thuongHieu: "Nova", danhMuc: "Điện thoại", gia: 12990000, moTa: "Màn hình đẹp, pin dùng cả ngày.", hinhAnh: "📱", soLuong: 12, noiBat: true }, // Điện thoại.
  { ten: "Tai nghe không dây", thuongHieu: "SoundUp", danhMuc: "Phụ kiện", gia: 1290000, moTa: "Âm thanh rõ, thiết kế thoải mái.", hinhAnh: "🎧", soLuong: 25, noiBat: true }, // Tai nghe.
  { ten: "Màn hình Vision 27", thuongHieu: "Vision", danhMuc: "Màn hình", gia: 4590000, moTa: "Không gian hiển thị rộng cho công việc.", hinhAnh: "🖥️", soLuong: 6, noiBat: false }, // Màn hình.
  { ten: "Bàn phím cơ Mini", thuongHieu: "KeyPro", danhMuc: "Phụ kiện", gia: 890000, moTa: "Gọn gàng, phù hợp góc làm việc nhỏ.", hinhAnh: "⌨️", soLuong: 18, noiBat: false }, // Bàn phím.
  { ten: "Chuột không dây", thuongHieu: "KeyPro", danhMuc: "Phụ kiện", gia: 390000, moTa: "Thiết kế tối giản, dễ mang theo.", hinhAnh: "🖱️", soLuong: 30, noiBat: false } // Chuột.
]; 

// Hàm chạy seed 
async function taoDuLieuMau() { // Khai báo hàm khởi tạo dữ liệu.
  try { // Bắt lỗi kết nối hoặc ghi dữ liệu.
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || "CongNgheStore" }); // Kết nối database.
    const collection = mongoose.connection.collection("sanphams"); // Truy cập collection mà Mongoose tạo cho model SanPham.
    const daCo = await collection.countDocuments(); // Đếm số document đã có.
    if (daCo === 0) { // Chỉ thêm dữ liệu nếu collection đang trống.
      await collection.insertMany(duLieuMau); // Chèn tất cả dữ liệu mẫu.
      console.log("Đã thêm", duLieuMau.length, "sản phẩm mẫu."); // In kết quả thành công.
    } else { // Nếu collection đã có dữ liệu.
      console.log("Đã có dữ liệu, không thêm trùng."); // Thông báo bỏ qua.
    } // Kết thúc điều kiện kiểm tra.
  } catch (loi) { // Xử lý lỗi nếu có.
    console.error("Không thể tạo dữ liệu:", loi.message); // In thông tin lỗi.
    process.exitCode = 1; // Đặt mã thoát báo lỗi.
  } finally { // Luôn đóng kết nối sau khi chạy.
    await mongoose.disconnect(); // Ngắt kết nối MongoDB.
  } // Kết thúc try/catch/finally.
} // Kết thúc hàm tạo dữ liệu.
taoDuLieuMau(); // Chạy script ngay khi gọi npm run seed.
