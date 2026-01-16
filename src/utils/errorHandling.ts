import { AxiosError } from "axios";
import { showToast } from "./toast";

export const handleApiError = (
  error: unknown,
  defaultMessage = "An error occurred"
) => {
  console.error("API Error:", error);

  if (error instanceof AxiosError) {
    const errorMessage =
      error.response?.data?.message || error.message || defaultMessage;
    showToast.error(errorMessage);
    return;
  }

  showToast.error(defaultMessage);
};
