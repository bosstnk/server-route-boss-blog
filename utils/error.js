export function createError({
  message,
  statusCode = 500,
  errors = null,
}) {
  const err = new Error(message);

  err.statusCode = statusCode;
  err.errors = errors;

  return err;
}

export const DB_ERROR = {
  UNIQUE: "23505",
};