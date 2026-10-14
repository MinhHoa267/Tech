import { NextResponse } from "next/server"; // Công cụ tạo phản hồi HTTP trong Next.js.
import { ketNoiMongoDB } from "@/lib/ket-noi-mongodb"; // Hàm kết nối cơ sở dữ liệu.
import SanPham from "@/models/SanPham"; // Model sản phẩm.

// Xử lý GET /api/san-pham: trả về danh sách sản phẩm từ MongoDB.
export async function GET() { // Tên GET là quy ước bắt buộc của Next.js Route Handler.
  try { // Bắt lỗi kết nối hoặc truy vấn.
    await ketNoiMongoDB(); // Kết nối tới MongoDB trước khi truy vấn.
    const danhSach = await SanPham.find({}).sort({ noiBat: -1, ngayTao: -1 }).lean(); // Lấy sản phẩm, ưu tiên nổi bật và mới nhất.
    return NextResponse.json(danhSach); // Trả danh sách dưới dạng JSON.
  } catch (loi) { // Bắt lỗi nếu truy vấn thất bại.
    console.error("Lỗi lấy sản phẩm:", loi.message); // Ghi lỗi kỹ thuật trong terminal máy chủ.
    return NextResponse.json({ loi: "Không thể tải sản phẩm. Hãy kiểm tra MongoDB." }, { status: 500 }); // Trả lỗi HTTP 500.
  } // Kết thúc try/catch.
} // Kết thúc API GET.
