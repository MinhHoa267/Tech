import mongoose from "mongoose"; // Nạp thư viện Mongoose để kết nối MongoDB.

// Lưu kết nối đang dùng ở biến toàn cục để tránh kết nối lặp khi Next.js tải lại trong môi trường phát triển.
let boNhoKetNoi = global.mongoose; // Đọc bộ nhớ kết nối đã có nếu tồn tại.

// Nếu chưa có bộ nhớ kết nối thì tạo cấu trúc lưu kết nối và lời hứa kết nối.
if (!boNhoKetNoi) { // Kiểm tra trạng thái bộ nhớ kết nối.
  boNhoKetNoi = global.mongoose = { ketNoi: null, loiHuaKetNoi: null }; // Khởi tạo nơi lưu kết nối.
}

// Hàm tiếng Việt này kết nối tới MongoDB và trả về kết nối đã thiết lập.
export async function ketNoiMongoDB() { // Khai báo hàm kết nối bất đồng bộ.
  if (boNhoKetNoi.ketNoi) return boNhoKetNoi.ketNoi; // Dùng lại kết nối hiện có nếu đã kết nối.
  if (!process.env.MONGODB_URI) throw new Error("Thiếu biến môi trường MONGODB_URI trong file .env.local"); // Báo lỗi nếu chưa cấu hình chuỗi kết nối.
  if (!boNhoKetNoi.loiHuaKetNoi) { // Chỉ tạo lời hứa kết nối một lần.
    const tuyChon = { bufferCommands: false, dbName: process.env.MONGODB_DB_NAME || "CongNgheStore" }; // Tắt đệm lệnh và chọn database.
    boNhoKetNoi.loiHuaKetNoi = mongoose.connect(process.env.MONGODB_URI, tuyChon).then((ketNoi) => ketNoi); // Bắt đầu kết nối và lưu kết quả.
  } // Kết thúc điều kiện tạo lời hứa.
  boNhoKetNoi.ketNoi = await boNhoKetNoi.loiHuaKetNoi; // Chờ kết nối hoàn tất.
  return boNhoKetNoi.ketNoi; // Trả về kết nối để các API sử dụng.
} // Kết thúc hàm kết nối.
