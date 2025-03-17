Full-stack Developer | E-commerce Enthusiast
Xây dựng và phát triển ứng dụng web với Next.js, React, TypeScript, Sanity.io, Stripe, Tailwind CSS, và Clerk. Hiện đang phát triển Chitan Store, một nền tảng thương mại điện tử thời trang, tập trung vào quản lý sản phẩm, thanh toán trực tuyến và trải nghiệm người dùng mượt mà.


# Chitan Store

## Giới thiệu
**Chitan Store** là một nền tảng thương mại điện tử chuyên về thời trang, được xây dựng nhằm cung cấp trải nghiệm mua sắm trực tuyến mượt mà, tiện lợi. Dự án tập trung vào quản lý sản phẩm, thanh toán trực tuyến và tối ưu hóa giao diện cho người dùng.

Dự án được phát triển với công nghệ **Next.js, TypeScript, Sanity.io, Stripe, Tailwind CSS** và **Clerk** để đảm bảo hiệu suất cao và bảo mật tốt nhất.

---
## Tính năng chính
- **Quản lý sản phẩm:** Thêm, chỉnh sửa, xoá và hiển thị danh sách sản phẩm.
- **Hỗ trợ nhiều vai trò:** Quản trị viên (Admin) và Người dùng (User).
- **Thanh toán trực tuyến:** Tích hợp **Stripe** để xử lý giao dịch an toàn.
- **Quản lý tài khoản:** Đăng nhập và đăng ký với **Clerk**.
- **Giao diện hiện đại:** Sử dụng **Tailwind CSS** để tối ưu hiệu suất và UI/UX.
- **Tìm kiếm sản phẩm:** Cho phép người dùng tìm kiếm sản phẩm nhanh chóng.
- **Theo dõi đơn hàng:** Hiển thị lịch sử đơn hàng và trạng thái thanh toán.

---
## Công nghệ sử dụng
| Công nghệ  | Mô tả |
|------------|------------------------------------------------|
| Next.js    | Framework React tối ưu SSR & SEO.              |
| TypeScript | Ngôn ngữ lập trình tĩnh giúp code an toàn hơn. |
| Sanity.io  | Hệ thống quản lý nội dung (CMS) hiện đại.      |
| Stripe     | Cổng thanh toán trực tuyến bảo mật.            |
| Tailwind CSS | Framework CSS giúp xây dựng giao diện nhanh. |
| Clerk      | Hệ thống xác thực người dùng (Auth).           |
| Vercel     | Nền tảng triển khai hosting cho Next.js.       |

---
## Cài đặt và chạy dự án
### 1. Clone dự án về máy
```bash
git clone https://github.com/MoiMoiTan/Chitan-Store.git
cd Chitan-Store
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Thiết lập biến môi trường
Tạo file `.env.local` và điền các thông tin cần thiết:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=your_sanity_dataset
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_api
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_KEY=your_stripe_webhook_key
```

### 4. Chạy server phát triển
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
# hoặc
bun dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để xem kết quả.

---
## Triển khai lên Vercel
Chitan Store được tối ưu hóa để chạy trên **Vercel**.
1. Cài đặt Vercel CLI:
```bash
npm install -g vercel
```
2. Đăng nhập vào Vercel:
```bash
vercel login
```
3. Triển khai dự án:
```bash
vercel
```

---
## Hướng dẫn sử dụng API Webhook của Stripe
Webhook của Stripe được sử dụng để cập nhật trạng thái đơn hàng khi thanh toán thành công.
- **Endpoint:** `/api/webhook`
- **Method:** `POST`
- **Mô tả:** Nhận dữ liệu từ Stripe khi giao dịch hoàn tất và cập nhật vào Sanity.io

Bạn cần đăng ký webhook trong Stripe với lệnh sau:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
Khi triển khai lên Vercel, cập nhật URL webhook trong Stripe Dashboard.

---
## Đóng góp
Mọi đóng góp để cải thiện Chitan Store đều được hoan nghênh! Hãy tạo Pull Request hoặc Issue nếu bạn muốn tham gia phát triển dự án.

---
## Liên hệ
- **GitHub:** [MoiMoiTan](https://github.com/MoiMoiTan/Chitan-Store)
- **Email:** moimoitan@example.com

---
## License
Dự án được phát hành theo giấy phép MIT.

---
Cảm ơn bạn đã ghé thăm và sử dụng **Chitan Store**! 🚀
