import "dotenv/config";

const require = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const envVars = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "5000", 10),

  DATABASE_URL: require("DATABASE_URL"),

  ACCESS_TOKEN_SECRET: require("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: require("REFRESH_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",

  BETTER_AUTH_SECRET: require("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:5000",

  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",

  CLOUDINARY_CLOUD_NAME: require("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: require("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: require("CLOUDINARY_API_SECRET"),

  STRIPE_SECRET_KEY: require("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: require("STRIPE_WEBHOOK_SECRET"),
} as const;
