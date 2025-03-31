# JWT Authentication API with Node.js

![Project Banner](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBY613NZ95cA9W6MguvlOqT8tLRGv29fNPMfVJRn5YsuRgYSKCI9gIdeVJLt_1IiTq1OQ5bJi-pYl7KMwK6vlhXw_1O6filJzTyw_1Jxvtc6VWl7yak6FZdJaCFCAhrAIjEKoCr6ORL3g0mXT_5Ugp1LNYaK62j-j0JaFbediRYtEoNf0CoSNAzwIxGDEz/s16000/node-login-register-blog.png)

A secure and scalable authentication system built with Node.js, featuring JWT, email verification, password recovery, and protected routes.

## Features

### 🏷 User Management
- ✅ Register new users (`userRegister`)
- ✅ Email verification system (`mailVerification`, `sendMailVerification`)
- ✅ Login with JWT tokens (`loginUser`)
- ✅ User profile management (`userProfile`, `updateProfile`)

### 🔒 Security
- 🔑 JWT authentication (`refreshToken`)
- 🔄 Refresh token rotation (`refreshToken`)
- 🔐 Password reset flow (`forgetPassword`, `resetPassword`, `updatePassword`, `resetSuccess`)
- 🚪 Secure logout (`logoutUser`)

### 🛡 API Protection
- 🏗 Authenticated endpoints with middleware
- 📛 Route protection using JWT verification
- 🔢 OTP-based authentication (`sendOtp`, `verifyOtp`)

## Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ndourmouhammad/kit-de-demarrage-node.git
cd jwt-auth-api
```

### 2️⃣ Install Dependencies
```bash
composer install
```

### 3️⃣ Configure Environment Variables
Create a .env file in the root directory and copy the example file:
```bash
cp .env.example .env
```


### 4️⃣ Start the Server
```bash
nodemon server.js
```

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & get token |
| `GET`  | `/api/auth/profile` | Get user profile (Protected) |
| `PUT`  | `/api/auth/profile` | Update user profile (Protected) |
| `POST` | `/api/auth/verify-email` | Verify user email |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset user password |
| `POST` | `/api/auth/logout` | Logout user |
| `POST` | `/api/auth/send-otp` | Send OTP for verification |
| `POST` | `/api/auth/verify-otp` | Verify OTP code |
| `POST` | `/api/auth/refresh-token` | Refresh JWT token |

## Technologies Used

- 🟢 **Node.js** - Server-side JavaScript runtime
- ⚡ **Express.js** - Fast and minimalist web framework
- 🔒 **JWT (JSON Web Tokens)** - Secure authentication
- 📩 **Nodemailer** - Email handling for verification & password recovery
- 🗄 **MongoDB + Mongoose** - NoSQL database for storing user data

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
🚀 **Built with ❤️ by [Mouhammad Ndour](https://github.com/ndourmouhammad)**


