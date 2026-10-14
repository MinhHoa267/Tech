import "./globals.css"; // Nạp CSS dùng chung cho toàn bộ website.

// Metadata hiển thị trên tab trình duyệt và hỗ trợ SEO cơ bản.
export const metadata = { // Khai báo thông tin website.
  title: "TechNhỏ | Cửa hàng công nghệ", // Tiêu đề trang.
  description: "Cửa hàng công nghệ nhỏ, dễ chọn và dễ mua." // Mô tả trang.
}; // Kết thúc metadata.

// Layout gốc bao bọc tất cả các trang trong ứng dụng.
export default function BoCucGoc({ children }) { // Nhận nội dung trang qua children.
  return ( // Bắt đầu giao diện JSX.
    <html lang="vi"> {/* Đặt ngôn ngữ website là tiếng Việt. */}
      <body>{children}</body> {/* Hiển thị trang hiện tại bên trong body. */}
    </html> // Kết thúc cấu trúc HTML.
  ); // Kết thúc JSX.
} // Kết thúc component layout.
