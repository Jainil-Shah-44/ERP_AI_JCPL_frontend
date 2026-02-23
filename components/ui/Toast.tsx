// components/Toast.tsx
"use client";

import { useEffect } from "react";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type ToastPropsType = {
  msg: string;
  type?: "info" | "success" | "warning" | "error" | "default";
  position?: ToastPosition;
  autoClose?: number;
  id?: number;
};

export default function Toast({
  msg,
  type = "default",
  position = "top-right",
  autoClose = 3000,
  id,
}: ToastPropsType) {
  useEffect(() => {
    toast(msg, { type, position, autoClose });
  }, [id, msg, type, position, autoClose]);
  

  return <ToastContainer position={position} autoClose={autoClose} hideProgressBar />;
}
