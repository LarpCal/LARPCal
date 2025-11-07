import { useParams } from "react-router-dom";

export function useIdParam(paramName?: string, required?: true): number;
export function useIdParam(paramName?: string, required?: false): number | null;
export function useIdParam(paramName = "id", required = true) {
  const params = useParams();
  const id = params[paramName];
  if (!id) {
    if (!required) {
      return null;
    }
    throw new Error("Id param is required");
  }
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId) || numericId <= 0) {
    if (!required) {
      return null;
    }
    throw new Error("Id param must be a positive number");
  }
  return numericId;
}
