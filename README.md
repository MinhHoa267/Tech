# TechNhỏ — cửa hàng công nghệ nhỏ

Dự án học tập dùng **Next.js App Router + React + MongoDB + Mongoose**. Giao diện đơn giản, responsive; có danh sách sản phẩm lấy từ MongoDB, tìm kiếm, lọc danh mục và giỏ hàng tạm ở trình duyệt.

> Lưu ý: đây là bản demo học tập, chưa có đăng nhập, thanh toán, tạo đơn hàng, xác thực quản trị hoặc bảo vệ chống đặt hàng giả.

## 1. Yêu cầu cài đặt

- Node.js phiên bản LTS (khuyến nghị Node.js 20 trở lên).
- MongoDB Community chạy trên máy hoặc tài khoản MongoDB Atlas.
- Có thể dùng MongoDB Compass để xem database và documents.

## 2. Chạy dự án

1. Giải nén thư mục dự án.
2. Mở terminal tại thư mục `cua-hang-cong-nghe`.
3. Cài các thư viện:
   ```bash
   npm install
   ```
4. Sao chép `.env.example` thành `.env.local`.
5. Nếu MongoDB chạy cục bộ, giữ nguyên `MONGODB_URI=mongodb://127.0.0.1:27017/CongNgheStore`. Nếu dùng Atlas, thay bằng connection string của bạn.
6. Khởi tạo dữ liệu mẫu:
   ```bash
   npm run seed
   ```
7. Chạy website:
   ```bash
   npm run dev
   ```
8. Mở `http://localhost:3000`.

Nếu không muốn chạy lệnh seed, mở trang rồi gửi POST tới `/api/san-pham/tao-mau` bằng công cụ API như Postman. Endpoint này chỉ tạo dữ liệu khi collection đang trống; không triển khai endpoint seed công khai trong website thật.

## 3. Cấu trúc thư mục

```text
app/
  api/san-pham/route.js             API GET danh sách sản phẩm
  api/san-pham/tao-mau/route.js     API POST tạo dữ liệu mẫu
  globals.css                       Giao diện responsive
  layout.js                         Layout chung và metadata
  page.js                           Trang chủ
components/
  CuaHang.js                        Giao diện tìm kiếm, lọc, giỏ hàng
lib/
  ket-noi-mongodb.js                Kết nối MongoDB
models/
  SanPham.js                        Schema và index sản phẩm
scripts/
  tao-du-lieu-mau.js                Script nạp dữ liệu mẫu
.env.example                        Mẫu biến môi trường
```

## 4. Các kiến thức MongoDB có trong dự án

- **Document database:** mỗi sản phẩm là một document JSON-like trong collection `sanphams`.
- **Schema Mongoose:** kiểm tra kiểu dữ liệu, trường bắt buộc, giá và số lượng.
- **Index:** `cauTrucSanPham.index({ ten: 1 })` tạo index tăng dần cho trường tên.
- **CRUD cơ bản:** `find`, `countDocuments`, `insertMany`.
- **Aggregation:** ví dụ truy vấn ở phần 5.
- **Replication và sharding:** là cấu hình ở cấp MongoDB deployment, không phải thứ tự động bật chỉ bằng code ứng dụng. Có thể thực hành bằng replica set cục bộ hoặc MongoDB Atlas khi học phần triển khai.

## 5. Ví dụ truy vấn Mongosh cho cửa hàng công nghệ

Chọn database và xem sản phẩm:

```javascript
use CongNgheStore
db.sanphams.find({})
db.sanphams.createIndex({ ten: 1 })
db.sanphams.find({ ten: /laptop/i })
db.sanphams.find({ gia: { $gte: 1000000 } }).sort({ gia: 1 })
```

Đếm số sản phẩm theo danh mục bằng aggregation:

```javascript
db.sanphams.aggregate([
  { $group: { _id: "$danhMuc", soLuongSanPham: { $sum: 1 }, giaTrungBinh: { $avg: "$gia" } } },
  { $sort: { soLuongSanPham: -1 } }
])
```

## 6. Cách đáp ứng đề bài BooksStore

Đề gốc yêu cầu database `BooksStore` với collection `books`, `authors` và các truy vấn sách. Website mẫu này dùng dữ liệu **sản phẩm công nghệ** nên schema khác đề sách. Nếu giảng viên chấm đúng rubric BooksStore, hãy bổ sung collection `books` và `authors` riêng, đặt database thành `BooksStore`, rồi dùng ví dụ truy vấn sau (giả sử mỗi book có `title`, `genre`, `created_at`, `publishing_year`, `author_id`, `num_of_favorites`, và mỗi author có `full_name`):

```javascript
use BooksStore

// Index trên title theo yêu cầu.
db.books.createIndex({ title: 1 })

// Tất cả sách được tạo trong năm hiện tại.
const dauNam = new Date(new Date().getFullYear(), 0, 1)
const dauNamSau = new Date(new Date().getFullYear() + 1, 0, 1)
db.books.find({ created_at: { $gte: dauNam, $lt: dauNamSau } })

// Tác giả có ít nhất 5 sách; dùng aggregation và lookup.
db.books.aggregate([
  { $group: { _id: "$author_id", soSach: { $sum: 1 } } },
  { $match: { soSach: { $gte: 5 } } },
  { $lookup: { from: "authors", localField: "_id", foreignField: "_id", as: "thongTinTacGia" } },
  { $unwind: "$thongTinTacGia" },
  { $project: { _id: 0, author_id: "$_id", author_full_name: "$thongTinTacGia.full_name", soSach: 1 } }
])

// Sách có title chứa programming và genre là Technology.
db.books.find({ title: /programming/i, genre: "Technology" })

// Danh sách trường sách cần nộp.
db.books.aggregate([
  { $lookup: { from: "authors", localField: "author_id", foreignField: "_id", as: "tacGia" } },
  { $unwind: "$tacGia" },
  { $project: { _id: 0, id: "$_id", title: 1, author_full_name: "$tacGia.full_name", publishing_year: 1, num_of_favorites: 1 } }
])
```

Để rubric trên chạy được, cần tạo ít nhất 5 documents hợp lệ trong `books` và documents tác giả tương ứng trong `authors`. Hãy điều chỉnh tên trường nếu ERD mà giảng viên cung cấp dùng tên khác.

## 7. Vì sao tên hàm có tiếng Việt?

Các hàm do mình tự viết đặt tên tiếng Việt không dấu để dễ đọc, ví dụ `ketNoiMongoDB`, `taoDuLieuMau`, `dinhDangTien`, `themVaoGio`. Một số tên không thể đổi vì là quy ước của framework/thư viện, ví dụ `GET`, `POST`, `find`, `insertMany`, `useState`, `useEffect`.

## 8. Lỗi thường gặp

- **ECONNREFUSED:** MongoDB chưa chạy hoặc URI sai.
- **Thiếu MONGODB_URI:** chưa tạo `.env.local` hoặc biến môi trường viết sai.
- **Không có sản phẩm:** chạy `npm run seed`, sau đó tải lại trang.
- **Port 3000 đang bận:** Next.js sẽ báo cổng khác để sử dụng.
# TechNho
# teachNho
