import { toast } from "react-toastify";

export const showToast = (message, position) => {
  toast.success(message, { position });

  // Stocker l'information dans le stockage local
  localStorage.setItem("toastMessage", message);
  localStorage.setItem("toastPosition", position);
};

export const clearToastStorage = () => {
  // Nettoyer les données stockées après les avoir utilisées
  localStorage.removeItem("toastMessage");
  localStorage.removeItem("toastPosition");
};
