import  {  useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
export function ToastEffect({ submitClicked, errorCreate, mensaje, setSubmitClicked,className }) {
    useEffect(() => {
      if (submitClicked) {
        if (errorCreate) {
          toast(mensaje, {
            position: "top-right",
            hideProgressBar: false,
            className: `bg-${className} text-white`,
            progress: undefined,
            toastId: "",
          });
        }
        setSubmitClicked(false);
      }
    }, [errorCreate, mensaje, submitClicked, setSubmitClicked,className]);
  
    return  ( <ToastContainer autoClose={2000} limit={1} />);
  }