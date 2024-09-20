import { notifications } from "@mantine/notifications";

export const showToast = (
  message: string,
  type: "success" | "error" | "updated" | "deleted"
) => {
  if (type === "success") {
    notifications.show({
      id: "hello-there",
      position: "bottom-right",
      withCloseButton: true,
      onClose: () => console.log("unmounted"),
      onOpen: () => console.log("mounted"),
      autoClose: 5000,
      title: "Success",
      message: message,
      color: "green",
      className: "my-notification-class",
      loading: false,
    });
  } else if (type === "error") {
    notifications.show({
      id: "hello-there",
      position: "bottom-right",
      withCloseButton: true,
      autoClose: 5000,
      title: "Error",
      message: message,
      color: "red",
      className: "my-notification-class",
      loading: false,
    });
  } else if (type === "updated") {
    notifications.show({
      id: "hello-there",
      position: "bottom-right",
      withCloseButton: true,
      autoClose: 5000,
      title: "Updated",
      message: message,
      color: "blue",
      className: "my-notification-class",
      loading: false,
    });
  } else if (type === "deleted") {
    notifications.show({
      id: "hello-there",
      position: "bottom-right",
      withCloseButton: true,
      onClose: () => console.log("unmounted"),
      onOpen: () => console.log("mounted"),
      autoClose: 5000,
      title: "Deleted",
      message: message,
      color: "grape",
      className: "my-notification-class",
      loading: false,
    });
  }
};
