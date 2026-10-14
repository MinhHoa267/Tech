"use client"; // Cho phép component dùng state, sự kiện và gọi API ở trình duyệt.

import { useEffect, useMemo, useState } from "react"; // Nạp các hook React cần thiết.

// Định dạng số thành tiền Việt Nam đồng.
function dinhDangTien(soTien) { // Hàm định dạng giá.
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(soTien); // Trả về chuỗi tiền dễ đọc.
} // Kết thúc hàm định dạng tiền.

// Danh sách danh mục để tạo nút lọc.
const DANH_MUC = ["Tất cả", "Laptop", "Điện thoại", "Phụ kiện", "Màn hình"]; // Khai báo danh mục tĩnh.

// Component chính của cửa hàng công nghệ.
export default function CuaHang() { // Khai báo giao diện cửa hàng.
  const [sanPhams, datSanPhams] = useState([]); // Lưu danh sách sản phẩm lấy từ backend.
  const [tuKhoa, datTuKhoa] = useState(""); // Lưu nội dung ô tìm kiếm.
  const [danhMucChon, datDanhMucChon] = useState("Tất cả"); // Lưu danh mục đang lọc.
  const [dangTai, datDangTai] = useState(true); // Hiển thị trạng thái đang tải.
  const [gioHang, datGioHang] = useState([]); // Lưu giỏ hàng tạm ở trình duyệt.
  const [thongBao, datThongBao] = useState(""); // Nội dung thông báo nhỏ cho người dùng.

  // Khi trang mở, gọi API để lấy sản phẩm từ MongoDB.
  useEffect(() => { // Chạy hiệu ứng sau lần render đầu tiên.
    async function taiSanPham() { // Hàm tải dữ liệu.
      try { // Bắt lỗi nếu API hoặc mạng gặp sự cố.
        const phanHoi = await fetch("/api/san-pham"); // Gửi GET request đến backend.
        const duLieu = await phanHoi.json(); // Đọc phản hồi dạng JSON.
        if (!phanHoi.ok) throw new Error(duLieu.loi || "Không tải được sản phẩm"); // Kiểm tra trạng thái HTTP.
        datSanPhams(duLieu); // Đưa dữ liệu nhận được vào state.
      } catch (loi) { // Nhận lỗi khi gọi API.
        datThongBao("Chưa kết nối được dữ liệu. Hãy kiểm tra MongoDB và file .env.local."); // Báo lỗi thân thiện.
      } finally { // Luôn chạy dù thành công hay thất bại.
        datDangTai(false); // Tắt trạng thái đang tải.
      } // Kết thúc try/catch/finally.
    } // Kết thúc hàm tải dữ liệu.
    taiSanPham(); // Thực thi hàm tải sản phẩm.
  }, []); // Mảng rỗng nghĩa là chỉ chạy khi component được gắn vào trang.

  // Lọc sản phẩm theo từ khóa và danh mục được chọn.
  const sanPhamHienThi = useMemo(() => { // Tính danh sách hiển thị khi dữ liệu lọc thay đổi.
    return sanPhams.filter((sanPham) => { // Duyệt qua từng sản phẩm.
      const khopTuKhoa = sanPham.ten.toLowerCase().includes(tuKhoa.toLowerCase()) || sanPham.thuongHieu.toLowerCase().includes(tuKhoa.toLowerCase()); // Tìm theo tên hoặc thương hiệu.
      const khopDanhMuc = danhMucChon === "Tất cả" || sanPham.danhMuc === danhMucChon; // Kiểm tra danh mục.
      return khopTuKhoa && khopDanhMuc; // Chỉ giữ sản phẩm thỏa cả hai điều kiện.
    }); // Kết thúc filter.
  }, [sanPhams, tuKhoa, danhMucChon]); // Tính lại khi một trong các giá trị này thay đổi.

  // Thêm sản phẩm vào giỏ; nếu đã có thì tăng số lượng.
  function themVaoGio(sanPham) { // Hàm xử lý nút thêm giỏ.
    datGioHang((gioCu) => { // Cập nhật dựa trên giỏ hàng hiện tại.
      const daCo = gioCu.find((mon) => mon._id === sanPham._id); // Kiểm tra sản phẩm đã có trong giỏ chưa.
      if (daCo) return gioCu.map((mon) => mon._id === sanPham._id ? { ...mon, soLuongGio: mon.soLuongGio + 1 } : mon); // Tăng số lượng nếu đã tồn tại.
      return [...gioCu, { ...sanPham, soLuongGio: 1 }]; // Thêm sản phẩm mới với số lượng một.
    }); // Kết thúc cập nhật giỏ.
    datThongBao(`Đã thêm "${sanPham.ten}" vào giỏ hàng.`); // Hiện thông báo thành công.
  } // Kết thúc hàm thêm giỏ.

  // Tính tổng số mặt hàng trong giỏ.
  const tongSoLuong = gioHang.reduce((tong, mon) => tong + mon.soLuongGio, 0); // Cộng số lượng từng món.
  // Tính tổng giá trị đơn hàng trong giỏ.
  const tongTien = gioHang.reduce((tong, mon) => tong + mon.gia * mon.soLuongGio, 0); // Cộng giá nhân số lượng.

  return ( // Bắt đầu giao diện cửa hàng.
    <main className="trang"> {/* Khung nội dung chính của website. */}
      <header className="thanh-dau"> {/* Thanh đầu trang. */}
        <a className="logo" href="/"> <span className="logo-bieu-tuong">✦</span> TechNhỏ </a> {/* Logo cửa hàng. */}
        <nav className="dieu-huong"> {/* Điều hướng nhanh. */}
          <a href="#san-pham">Sản phẩm</a> {/* Cuộn tới danh sách sản phẩm. */}
          <a href="#gio-hang">Giỏ hàng ({tongSoLuong})</a> {/* Hiện số món trong giỏ. */}
        </nav> {/* Kết thúc điều hướng. */}
        <span className="nhan-an-toan">● Mua sắm dễ dàng</span> {/* Nhãn tạo cảm giác tin cậy. */}
      </header> {/* Kết thúc thanh đầu trang. */}

      <section className="anh-bia"> {/* Khu vực giới thiệu lớn. */}
        <div className="anh-bia-noi-dung"> {/* Cột chữ của banner. */}
          <p className="nhan-nho">CÔNG NGHỆ CHO MỌI NGƯỜI</p> {/* Dòng giới thiệu nhỏ. */}
          <h1>Nâng cấp góc công nghệ của bạn.</h1> {/* Tiêu đề chính. */}
          <p className="mo-ta-bia">Chọn thiết bị phù hợp, mức giá dễ chịu và trải nghiệm mua sắm thật đơn giản.</p> {/* Mô tả ngắn. */}
          <a className="nut nut-sang" href="#san-pham">Khám phá sản phẩm <span>→</span></a> {/* Nút cuộn đến sản phẩm. */}
        </div> {/* Kết thúc cột chữ. */}
        <div className="minh-hoa-bia" aria-hidden="true"> {/* Hình minh họa bằng emoji, không cần ảnh ngoài. */}
          <div className="vong-tron"></div> {/* Hình tròn trang trí phía sau. */}
          <div className="thiet-bi laptop">💻</div> {/* Minh họa laptop. */}
          <div className="thiet-bi dien-thoai">📱</div> {/* Minh họa điện thoại. */}
          <div className="thiet-bi tai-nghe">🎧</div> {/* Minh họa tai nghe. */}
        </div> {/* Kết thúc hình minh họa. */}
      </section> {/* Kết thúc banner. */}

      <section className="loi-ich"> {/* Ba lợi ích nổi bật. */}
        <div><span>🚚</span><div><strong>Giao hàng tiện lợi</strong><small>Đặt hàng nhanh chóng</small></div></div> {/* Lợi ích giao hàng. */}
        <div><span>🛡️</span><div><strong>Sản phẩm chọn lọc</strong><small>Thông tin rõ ràng</small></div></div> {/* Lợi ích sản phẩm. */}
        <div><span>💬</span><div><strong>Hỗ trợ thân thiện</strong><small>Luôn sẵn sàng tư vấn</small></div></div> {/* Lợi ích hỗ trợ. */}
      </section> {/* Kết thúc lợi ích. */}

      <section className="khu-vuc-san-pham" id="san-pham"> {/* Khu vực danh sách sản phẩm. */}
        <div className="tieu-de-khu-vuc"> {/* Tiêu đề và mô tả danh sách. */}
          <div><p className="nhan-nho">BỘ SƯU TẬP</p><h2>Sản phẩm nổi bật</h2><p className="mo-ta-khu-vuc">Thiết bị hữu ích cho học tập, làm việc và giải trí.</p></div> {/* Nội dung tiêu đề. */}
          <label className="tim-kiem"><span>⌕</span><input value={tuKhoa} onChange={(suKien) => datTuKhoa(suKien.target.value)} placeholder="Tìm sản phẩm..." aria-label="Tìm sản phẩm" /></label> {/* Ô tìm kiếm theo tên hoặc thương hiệu. */}
        </div> {/* Kết thúc tiêu đề khu vực. */}

        <div className="cac-danh-muc"> {/* Các nút lọc danh mục. */}
          {DANH_MUC.map((danhMuc) => <button key={danhMuc} className={danhMucChon === danhMuc ? "nut-danh-muc dang-chon" : "nut-danh-muc"} onClick={() => datDanhMucChon(danhMuc)}>{danhMuc}</button>)} {/* Tạo một nút cho mỗi danh mục. */}
        </div> {/* Kết thúc danh mục. */}

        {thongBao && <p className="thong-bao" role="status">{thongBao}</p>} {/* Hiện thông báo nếu có. */}
        {dangTai ? <p className="trang-thai">Đang tải sản phẩm...</p> : sanPhamHienThi.length === 0 ? <p className="trang-thai">Không tìm thấy sản phẩm phù hợp.</p> : ( /* Chọn giao diện theo trạng thái tải và kết quả lọc. */
          <div className="luoi-san-pham"> {/* Lưới các thẻ sản phẩm. */}
            {sanPhamHienThi.map((sanPham) => ( /* Tạo một thẻ cho từng sản phẩm. */
              <article className="the-san-pham" key={sanPham._id}> {/* Thẻ sản phẩm riêng biệt. */}
                <div className={`vung-hinh nen-${sanPham.danhMuc.toLowerCase().replaceAll(" ", "-")}`}> {/* Vùng hình minh họa có nền theo danh mục. */}
                  {sanPham.noiBat && <span className="nhan-noi-bat">Nổi bật</span>} {/* Gắn nhãn nếu là sản phẩm nổi bật. */}
                  <span className="emoji-san-pham">{sanPham.hinhAnh}</span> {/* Hiện emoji sản phẩm. */}
                </div> {/* Kết thúc vùng hình. */}
                <div className="noi-dung-the"> {/* Nội dung và giá. */}
                  <p className="thuong-hieu">{sanPham.thuongHieu} · {sanPham.danhMuc}</p> {/* Hiện thương hiệu và danh mục. */}
                  <h3>{sanPham.ten}</h3> {/* Tên sản phẩm. */}
                  <p className="mo-ta-san-pham">{sanPham.moTa}</p> {/* Mô tả sản phẩm. */}
                  <div className="hang-gia"><strong>{dinhDangTien(sanPham.gia)}</strong><button className="nut-them" onClick={() => themVaoGio(sanPham)} aria-label={`Thêm ${sanPham.ten} vào giỏ`}>+</button></div> {/* Giá và nút thêm vào giỏ. */}
                </div> {/* Kết thúc nội dung thẻ. */}
              </article> /* Kết thúc một thẻ sản phẩm. */
            ))} {/* Kết thúc vòng lặp sản phẩm. */}
          </div> /* Kết thúc lưới sản phẩm. */
        )} {/* Kết thúc điều kiện hiển thị. */}
      </section> {/* Kết thúc khu vực sản phẩm. */}

      <section className="khu-vuc-gio" id="gio-hang"> {/* Khu vực giỏ hàng. */}
        <div><p className="nhan-nho">ĐƠN HÀNG CỦA BẠN</p><h2>Giỏ hàng</h2><p className="mo-ta-khu-vuc">Giỏ hàng mẫu lưu trong trạng thái trình duyệt, chưa tạo đơn thật.</p></div> {/* Giới thiệu giỏ hàng. */}
        {gioHang.length === 0 ? <div className="gio-rong">🛍️ <span>Giỏ hàng đang trống. Hãy chọn món bạn thích nhé!</span></div> : ( /* Hiện lời nhắc hoặc các món đã chọn. */
          <div className="danh-sach-gio"> {/* Danh sách mặt hàng trong giỏ. */}
            {gioHang.map((mon) => <div className="dong-gio" key={mon._id}><span>{mon.hinhAnh} {mon.ten} <small>× {mon.soLuongGio}</small></span><strong>{dinhDangTien(mon.gia * mon.soLuongGio)}</strong></div>)} {/* Hiện tên, số lượng và thành tiền. */}
            <div className="tong-tien"><span>Tổng cộng</span><strong>{dinhDangTien(tongTien)}</strong></div> {/* Hiện tổng giá trị giỏ hàng. */}
          </div> /* Kết thúc danh sách giỏ. */
        )} {/* Kết thúc điều kiện giỏ hàng. */}
      </section> {/* Kết thúc khu vực giỏ. */}

      <footer className="chan-trang"><a className="logo" href="/">✦ TechNhỏ</a><p>Đồ công nghệ hữu ích · Thiết kế đơn giản · Dễ sử dụng</p><small>© 2026 TechNhỏ — Dự án học tập Next.js + MongoDB</small></footer> {/* Chân trang website. */}
    </main> {/* Kết thúc nội dung chính. */}
  ); // Kết thúc JSX.
} // Kết thúc component cửa hàng.
