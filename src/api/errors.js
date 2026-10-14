export function getApiError(error, fallbackMessage) {
  const data = error?.response?.data;

  if (!data) {
    return error?.request
      ? "ارتباط با سرور برقرار نشد."
      : fallbackMessage;
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  const firstError = Object.values(data).flat(Infinity)[0];
  return firstError || fallbackMessage;
}
