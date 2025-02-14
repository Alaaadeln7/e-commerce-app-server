export const ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SELLER: "seller",
};
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "paid",
  FAILED: "failed",
};

export const COOKIE_OPTIONS = {
  maxAge: 7 * 60 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV !== "development",
};

export const CORS_OPTIONS = {
  origin: "http://localhost:5173",
  credentials: true,
};

export const RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

export const SWAGGER_OPTIONS = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API for E-commerce platform",
    },
  },
  apis: ["./docs/**/*.js"],
};
