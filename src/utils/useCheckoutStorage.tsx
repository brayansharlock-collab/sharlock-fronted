import { useCallback } from "react";

export function useCheckoutStorage() {
  const saveStep = useCallback((step: string, data: any) => {
    const prev = JSON.parse(localStorage.getItem("checkout") || "{}");
    const updated = { ...prev, [step]: data };
    localStorage.setItem("checkout", JSON.stringify(updated));
  }, []);

  const getStep = useCallback((step: string) => {
    const data = JSON.parse(localStorage.getItem("checkout") || "{}");
    return data[step];
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem("checkout");
  }, []);

  return { saveStep, getStep, clear };
}
