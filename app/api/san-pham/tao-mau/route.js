import { NextResponse } from "next/server"; // Tạo phản hồi JSON.
import { ketNoiMongoDB } from "@/lib/ket-noi-mongodb"; // Nhập hàm kết nối database.
import SanPham from "@/models/SanPham"; // Nhập model sản phẩm.

// Xử lý POST /api/san-pham/tao-mau để thêm dữ liệu mẫu vào database.
export async function POST() { // POST là tên handler mà Next.js yêu cầu.
  try { // Bắt lỗi để API không bị dừng đột ngột.
    await ketNoiMongoDB(); // Đảm bảo đã kết nối MongoDB.
    const soLuongHienCo = await SanPham.countDocuments(); // Đếm số sản phẩm hiện có.
    if (soLuongHienCo > 0) return NextResponse.json({ thongBao: "Database đã có dữ liệu, không thêm lại.", soLuongHienCo }); // Tránh thêm dữ liệu trùng mỗi lần bấm.
    const duLieuMau = [ // Mảng sản phẩm mẫu để học cách tạo documents.
      { ten: "Laptop Air 14", thuongHieu: "Nova", danhMuc: "Laptop", gia: 18990000, moTa: "Nhẹ, gọn cho học tập và làm việc.", hinhAnh: "💻", soLuong: 8, noiBat: true }, // Sản phẩm laptop.
      { ten: "Điện thoại Nova X", thuongHieu: "Nova", danhMuc: "Điện thoại", gia: 12990000, moTa: "Màn hình đẹp, pin dùng cả ngày.", hinhAnh: "📱", soLuong: 12, noiBat: true }, // Sản phẩm điện thoại.
      { ten: "Tai nghe không dây", thuongHieu: "SoundUp", danhMuc: "Phụ kiện", gia: 1290000, moTa: "Âm thanh rõ, thiết kế thoải mái.", hinhAnh: "🎧", soLuong: 25, noiBat: true }, // Sản phẩm tai nghe.
      { ten: "Màn hình Vision 27", thuongHieu: "Vision", danhMuc: "Màn hình", gia: 4590000, moTa: "Không gian hiển thị rộng cho công việc.", hinhAnh: "🖥️", soLuong: 6, noiBat: false }, // Sản phẩm màn hình.
      { ten: "Bàn phím cơ Mini", thuongHieu: "KeyPro", danhMuc: "Phụ kiện", gia: 890000, moTa: "Gọn gàng, phù hợp góc làm việc nhỏ.", hinhAnh: "⌨️", soLuong: 18, noiBat: false }, // Sản phẩm bàn phím.
      { ten: "Chuột không dây", thuongHieu: "KeyPro", danhMuc: "Phụ kiện", gia: 390000, moTa: "Thiết kế tối giản, dễ mang theo.", hinhAnh: "🖱️", soLuong: 30, noiBat: false } // Sản phẩm chuột.
    ]; // Kết thúc mảng dữ liệu mẫu.
    const daTao = await SanPham.insertMany(duLieuMau); // Thêm các document vào collection.
    return NextResponse.json({ thongBao: "Đã tạo dữ liệu mẫu.", soLuong: daTao.length }, { status: 201 }); // Trả về số sản phẩm đã tạo.
  } catch (loi) { // Bắt lỗi tạo dữ liệu.
    console.error("Lỗi tạo dữ liệu mẫu:", loi.message); // Ghi lỗi trong terminal.
    return NextResponse.json({ loi: "Không thể tạo dữ liệu mẫu." }, { status: 500 }); // Trả lỗi cho trình duyệt.
  } // Kết thúc try/catch.
} // Kết thúc API POST.
