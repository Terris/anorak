import { useEffect } from "react";

export function useModalBodyClassSwitch() {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
}
