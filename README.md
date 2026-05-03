# Prescripto

Prescripto la he thong dat lich kham benh gom 3 ung dung rieng:

- `frontend`: giao dien nguoi dung de xem bac si, dang ky/dang nhap, dat lich, quan ly ho so va thanh toan.
- `admin`: trang quan tri cho admin va bac si de quan ly lich hen, bac si, nguoi dung, doanh thu va ho so bac si.
- `backend`: REST API Express ket noi MongoDB, Cloudinary va cac cong thanh toan Stripe/Razorpay.

## Cong nghe su dung

- Frontend/Admin: React 18, Vite, React Router, Axios, Tailwind CSS, React Toastify.
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, Multer, Cloudinary.
- Thanh toan: Stripe Checkout va Razorpay.
- Tai lieu API: cac file Postman collection va environment o thu muc goc.

## Cau truc thu muc

```text
Prescripto/
├── backend/                  # Express API
│   ├── config/               # MongoDB, Cloudinary
│   ├── controllers/          # Xu ly nghiep vu admin/doctor/user
│   ├── middleware/           # Auth JWT, multer
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   └── server.js
├── frontend/                 # Ung dung khach hang
├── admin/                    # Ung dung quan tri/admin-doctor
└── *_Collection.json         # Postman collections
```

## Yeu cau

- Node.js 18 tro len.
- MongoDB Atlas hoac MongoDB local.
- Tai khoan Cloudinary de upload anh bac si/nguoi dung.
- Tai khoan Stripe/Razorpay neu muon chay thanh toan online.

## Cai dat

Cai dependency cho tung phan:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

## Cau hinh bien moi truong

### Backend

Tao file `backend/.env` theo mau `backend/.env.example`:

```env
CURRENCY="USD"
JWT_SECRET="your_jwt_secret"

ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin123"

MONGODB_URI="mongodb+srv://..."

CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_SECRET_KEY="your_cloudinary_secret_key"

RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

STRIPE_SECRET_KEY="your_stripe_secret_key"
```

### Frontend

Tao file `frontend/.env`:

```env
VITE_BACKEND_URL="http://localhost:4000"
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

### Admin

Tao file `admin/.env`:

```env
VITE_BACKEND_URL="http://localhost:4000"
VITE_CURRENCY="$"
```

## Chay du an

Mo 3 terminal rieng:

```bash
cd backend
npm run server
```

```bash
cd frontend
npm run dev
```

```bash
cd admin
npm run dev
```

Mac dinh:

- Backend: `http://localhost:4000`
- Frontend Vite: `http://localhost:5173`
- Admin Vite: `http://localhost:5174` hoac port Vite tu dong hien thi tren terminal neu `5173` da duoc dung.

Kiem tra API:

```bash
curl http://localhost:4000/
```

Ket qua mong doi:

```text
API Working
```

## Scripts

Backend:

```bash
npm start       # chay node server.js
npm run server  # chay nodemon server.js
```

Frontend/Admin:

```bash
npm run dev      # chay moi truong phat trien
npm run build    # build production
npm run preview  # xem ban build
npm run lint     # kiem tra ESLint
```

## Tai khoan va phan quyen

- User dang ky/dang nhap tu `frontend`.
- Admin dang nhap bang `ADMIN_EMAIL` va `ADMIN_PASSWORD` trong `backend/.env`.
- Doctor dang nhap bang email/password duoc tao khi admin them bac si.
- API xac thuc bang JWT token trong header `token`.

## Chuc nang chinh

### Nguoi dung

- Dang ky, dang nhap.
- Xem danh sach bac si va loc theo chuyen khoa.
- Xem chi tiet bac si va khung gio con trong.
- Dat lich kham.
- Xem/huy lich hen.
- Cap nhat ho so ca nhan va anh dai dien.
- Thanh toan lich hen qua Stripe hoac Razorpay.

### Admin

- Dang nhap trang quan tri.
- Them bac si moi kem anh dai dien Cloudinary.
- Xem dashboard tong quan.
- Xem/huy lich hen.
- Bat/tat trang thai san sang cua bac si.
- Xem/xoa bac si.
- Xem/xoa nguoi dung.

### Doctor

- Dang nhap bang tai khoan bac si.
- Xem dashboard bac si.
- Xem, huy hoac danh dau hoan thanh lich hen.
- Cap nhat phi kham, dia chi va trang thai san sang.

## API chinh

Base URL: `http://localhost:4000`

### User

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| `POST` | `/api/user/register` | Dang ky user |
| `POST` | `/api/user/login` | Dang nhap user |
| `GET` | `/api/user/get-profile` | Lay ho so user |
| `POST` | `/api/user/update-profile` | Cap nhat ho so user |
| `POST` | `/api/user/book-appointment` | Dat lich hen |
| `GET` | `/api/user/appointments` | Lay danh sach lich hen cua user |
| `POST` | `/api/user/cancel-appointment` | Huy lich hen |
| `POST` | `/api/user/payment-razorpay` | Tao don thanh toan Razorpay |
| `POST` | `/api/user/verifyRazorpay` | Xac minh thanh toan Razorpay |
| `POST` | `/api/user/payment-stripe` | Tao Stripe Checkout session |
| `POST` | `/api/user/verifyStripe` | Xac minh ket qua Stripe |

### Doctor

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| `GET` | `/api/doctor/list` | Lay danh sach bac si cong khai |
| `POST` | `/api/doctor/login` | Dang nhap bac si |
| `GET` | `/api/doctor/appointments` | Lay lich hen cua bac si |
| `POST` | `/api/doctor/cancel-appointment` | Bac si huy lich hen |
| `POST` | `/api/doctor/complete-appointment` | Danh dau lich hen hoan thanh |
| `GET` | `/api/doctor/dashboard` | Du lieu dashboard bac si |
| `GET` | `/api/doctor/profile` | Lay ho so bac si |
| `POST` | `/api/doctor/update-profile` | Cap nhat ho so bac si |
| `POST` | `/api/doctor/change-availability` | Doi trang thai san sang |

### Admin

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| `POST` | `/api/admin/login` | Dang nhap admin |
| `POST` | `/api/admin/add-doctor` | Them bac si |
| `GET` | `/api/admin/appointments` | Lay tat ca lich hen |
| `POST` | `/api/admin/cancel-appointment` | Admin huy lich hen |
| `GET` | `/api/admin/all-doctors` | Lay tat ca bac si |
| `POST` | `/api/admin/change-availability` | Doi trang thai san sang cua bac si |
| `GET` | `/api/admin/dashboard` | Du lieu dashboard admin |
| `POST` | `/api/admin/delete-doctor` | Xoa bac si |
| `GET` | `/api/admin/all-users` | Lay tat ca nguoi dung |
| `POST` | `/api/admin/delete-user` | Xoa nguoi dung |

## Postman

Thu muc goc co san cac file de import vao Postman:

- `Admin_API_Collection.json`, `Admin_Environment.json`
- `Doctor_API_Collection.json`, `Doctor_Environment.json`
- `Payment_API_Collection.json`, `Payment_Environment.json`
- `Book_Appointment_Test.json`
- `Prescripto_Environment.json`

Sau khi import, cap nhat bien `baseUrl`, token va cac id mau theo du lieu local cua ban.

## Build va deploy

Build frontend:

```bash
cd frontend
npm run build
```

Build admin:

```bash
cd admin
npm run build
```

Hai ung dung Vite da co `vercel.json` de rewrite SPA ve `/`. Khi deploy, can cau hinh bien moi truong tuong ung tren nen tang deploy.

Backend can deploy len moi truong Node.js va khai bao day du cac bien trong `backend/.env`.

## Luu y phat trien

- Backend dang bat CORS cho moi origin bang `cors()`.
- File upload anh di qua `multer` va Cloudinary.
- Khi huy lich hen, backend giai phong lai slot cua bac si.
- Mot so controller co code VietQR nhung route hien tai chua expose cac endpoint VietQR trong `backend/routes/userRoute.js`.
- Khong commit file `.env` co chua secret len Git.
