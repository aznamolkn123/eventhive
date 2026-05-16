import { useEffect } from "react";
import toast from "react-hot-toast";

const ToastListener = () => {
  useEffect(() => {
    const handleToast = (e) => {
      const { message, type } = e.detail;
      if (type === "success") {
        toast.success(message);
      } else {
        toast.error(message);
      }
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  return null;
};

export default ToastListener;