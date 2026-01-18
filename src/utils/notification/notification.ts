import toast from "react-hot-toast";

type NotificationType = "success" | "error" | "info" | "warning";

export const showNotification = (
  message: string,
  type: NotificationType = "info"
) => {
  switch (type) {
    case "success":
      toast.success(message, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      break;

    case "error":
      toast.error(message, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
      break;

    default:
      toast(message, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#3B82F6",
          color: "#fff",
        },
      });
  }
};

export default showNotification;
