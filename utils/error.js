export function createError(message, statusCode) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
  }
  
  export const DB_ERROR = {
    UNIQUE: "23505",
  };