const allowedOrigins = ["http://localhost:3000"];

// Use a function to check if the request origin is allowed
export const corsOptions = {
  origin: allowedOrigins,
};
