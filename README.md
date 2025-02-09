# E-Commerce API

A full-featured E-commerce REST API built with modern technologies and best practices.

## 🛠 Technologies Used

- Node.js & Express.js
- MongoDB & Mongoose
- Redis for caching
- JWT Authentication
- Stripe Payment Integration
- Swagger/OpenAPI Documentation
- Docker & Docker Compose
- WebSocket for real-time notifications

## ✨ Features

- User Management & Authentication
- Product Management
- Shopping Cart
- Order Processing
- Payment Integration
- Review System
- Discount Management
- Real-time Notifications
- Admin Dashboard
- Comprehensive API Documentation

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js 18+ (for local development)

### Running with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd e-commerce-app-server
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

The application will be available at:
- API: http://localhost:9090
- API Documentation: http://localhost:9090/api-docs

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 API Documentation

The API documentation is available at `/api-docs` when the server is running. It provides detailed information about:
- Available endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation
- Rate limiting
- Secure password hashing
- HTTP-only cookies
- CORS protection
- MongoDB injection prevention

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📦 Docker Services

The application runs with the following services:
- **API**: Node.js application
- **MongoDB**: Database
- **Redis**: Caching
- **Mongo Express**: MongoDB admin interface

## 🔧 Environment Variables

Key environment variables needed:
- `NODE_ENV`: Application environment
- `PORT`: Application port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe API key
- See `.env.example` for all required variables

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📞 Support

For support, email alaaadelnn120@gmail.com or create an issue in the repository.
