export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  error?: unknown;
};

export const ok = <T>(message: string, data: T): ApiSuccess<T> => ({
  success: true,
  message,
  data
});

export const fail = (message: string, error?: unknown): ApiFailure => ({
  success: false,
  message,
  error
});
