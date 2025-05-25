# Hướng dẫn sử dụng API Thanh toán trong Prescripto

Tài liệu này hướng dẫn cách sử dụng API thanh toán (Razorpay và Stripe) trong dự án Prescripto.

## 1. Cài đặt và cấu hình

### Import Collection và Environment

1. Mở Postman
2. Nhấp vào nút "Import" (góc trên bên trái)
3. Chọn tab "File" 
4. Tìm và chọn hai file sau:
   - `Payment_API_Collection.json`
   - `Payment_Environment.json`
5. Nhấp vào "Import"
6. Chọn environment "Prescripto Payment" từ dropdown ở góc trên bên phải

### Cấu hình .env

Đảm bảo rằng file `.env` trong thư mục backend đã được cấu hình đúng với các thông tin Razorpay và Stripe:

```
# Razorpay Payment Integration
RAZORPAY_KEY_ID = "your_razorpay_key_id"
RAZORPAY_KEY_SECRET = "your_razorpay_key_secret"

# Stripe Payment Integration
STRIPE_SECRET_KEY = "your_stripe_secret_key"

# Currency
CURRENCY = "USD"
```

## 2. Quy trình thanh toán

### Quy trình thanh toán Razorpay

1. **Đăng nhập** - Lấy token xác thực
2. **Lấy danh sách lịch khám** - Lấy ID lịch khám cần thanh toán
3. **Tạo đơn hàng Razorpay** - Tạo đơn hàng trong hệ thống Razorpay
4. **Thanh toán** - Thông thường được thực hiện trên giao diện người dùng bằng Razorpay SDK
5. **Xác nhận thanh toán** - Xác nhận thanh toán đã hoàn tất

### Quy trình thanh toán Stripe

1. **Đăng nhập** - Lấy token xác thực
2. **Lấy danh sách lịch khám** - Lấy ID lịch khám cần thanh toán
3. **Tạo phiên thanh toán Stripe** - Tạo phiên thanh toán và nhận URL chuyển hướng
4. **Thanh toán** - Chuyển hướng người dùng đến URL của Stripe để hoàn tất thanh toán
5. **Xác nhận thanh toán** - Xác nhận thanh toán đã hoàn tất (thông qua URL callback)

## 3. Chi tiết API

### 3.1. Đăng nhập Người dùng

- **Method**: POST
- **URL**: `{{baseUrl}}/user/login`
- **Body**:
```json
{
    "email": "user@test.com",
    "password": "password123"
}
```
- **Response**:
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

> **Lưu ý**: Token sẽ tự động được lưu vào biến `userToken` trong environment

### 3.2. Lấy danh sách lịch khám

- **Method**: GET
- **URL**: `{{baseUrl}}/user/appointments`
- **Headers**: 
  - Authorization: `{{userToken}}`
- **Response**:
```json
{
    "success": true,
    "appointments": [
        {
            "_id": "6123456789abcdef12345678",
            "userId": "5123456789abcdef12345678",
            "docId": "7123456789abcdef12345678",
            "amount": 500,
            "slotTime": "10:00 AM",
            "slotDate": "13_5_2025",
            "payment": false,
            "cancelled": false,
            "isCompleted": false,
            "date": "2025-05-11T12:00:00.000Z"
        }
    ]
}
```

> **Lưu ý**: ID của lịch khám đầu tiên sẽ tự động được lưu vào biến `appointmentId` trong environment

### 3.3. Thanh toán Razorpay

#### 3.3.1. Tạo đơn hàng Razorpay

- **Method**: POST
- **URL**: `{{baseUrl}}/user/payment-razorpay`
- **Headers**: 
  - Authorization: `{{userToken}}`
  - Content-Type: application/json
- **Body**:
```json
{
    "appointmentId": "{{appointmentId}}"
}
```
- **Response**:
```json
{
    "success": true,
    "order": {
        "id": "order_123456789",
        "entity": "order",
        "amount": 50000,
        "amount_paid": 0,
        "amount_due": 50000,
        "currency": "USD",
        "receipt": "6123456789abcdef12345678",
        "status": "created",
        "attempts": 0,
        "created_at": 1714540800
    }
}
```

> **Lưu ý**: ID của đơn hàng Razorpay sẽ tự động được lưu vào biến `razorpayOrderId` trong environment

#### 3.3.2. Xác nhận thanh toán Razorpay

- **Method**: POST
- **URL**: `{{baseUrl}}/user/verifyRazorpay`
- **Headers**: 
  - Authorization: `{{userToken}}`
  - Content-Type: application/json
- **Body**:
```json
{
    "razorpay_order_id": "{{razorpayOrderId}}",
    "razorpay_payment_id": "pay_sample123456",
    "razorpay_signature": "signature_sample123456"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Payment Successful"
}
```

> **Lưu ý**: Trong môi trường thực tế, `razorpay_payment_id` và `razorpay_signature` sẽ được cung cấp bởi SDK Razorpay sau khi người dùng hoàn tất thanh toán.

### 3.4. Thanh toán Stripe

#### 3.4.1. Tạo phiên thanh toán Stripe

- **Method**: POST
- **URL**: `{{baseUrl}}/user/payment-stripe`
- **Headers**: 
  - Authorization: `{{userToken}}`
  - Content-Type: application/json
  - origin: http://localhost:5173
- **Body**:
```json
{
    "appointmentId": "{{appointmentId}}"
}
```
- **Response**:
```json
{
    "success": true,
    "session_url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

> **Lưu ý**: URL phiên thanh toán Stripe sẽ tự động được lưu vào biến `stripeSessionUrl` trong environment

#### 3.4.2. Xác nhận thanh toán Stripe

- **Method**: POST
- **URL**: `{{baseUrl}}/user/verifyStripe`
- **Headers**: 
  - Authorization: `{{userToken}}`
  - Content-Type: application/json
- **Body**:
```json
{
    "appointmentId": "{{appointmentId}}",
    "success": "true"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Payment Successful"
}
```

> **Lưu ý**: Trong môi trường thực tế, việc xác nhận thanh toán Stripe sẽ được thực hiện thông qua URL callback sau khi người dùng hoàn tất thanh toán trên trang của Stripe.

## 4. Xử lý lỗi thường gặp

1. **Lỗi xác thực**:
   - Đảm bảo bạn đã đăng nhập và token người dùng đã được lưu vào environment
   - Kiểm tra token có hợp lệ và chưa hết hạn

2. **Lỗi khi tạo đơn hàng Razorpay hoặc phiên thanh toán Stripe**:
   - Kiểm tra thông tin cấu hình Razorpay/Stripe trong file `.env`
   - Đảm bảo lịch khám tồn tại và chưa bị hủy
   - Kiểm tra kết nối internet

3. **Lỗi khi xác nhận thanh toán**:
   - Đảm bảo đã cung cấp đúng các tham số cần thiết
   - Kiểm tra trạng thái thanh toán trong hệ thống Razorpay/Stripe

## 5. Lưu ý khi test API thanh toán

1. **Razorpay**:
   - Trong môi trường phát triển, bạn có thể sử dụng tài khoản test của Razorpay
   - Cần thay thế `razorpay_payment_id` và `razorpay_signature` bằng giá trị thực khi test trên giao diện người dùng

2. **Stripe**:
   - Stripe cung cấp các thẻ test để sử dụng trong môi trường phát triển (ví dụ: 4242 4242 4242 4242)
   - Trong Postman, bạn chỉ có thể test phần tạo phiên thanh toán và xác nhận kết quả, không thể hoàn tất quá trình thanh toán
   - Để test toàn bộ luồng thanh toán, bạn cần sử dụng giao diện người dùng

3. **Tích hợp vào giao diện người dùng**:
   - Razorpay: Cần tích hợp Razorpay SDK vào frontend
   - Stripe: Cần chuyển hướng người dùng đến URL phiên thanh toán Stripe
