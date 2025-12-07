import { useQuery } from "@tanstack/react-query";
import LarpAPI from "../util/api";

export function useNewsletter(id: number | null) {
  return useQuery({
    queryKey: ["newsletter", id],
    queryFn: async () => LarpAPI.getNewsletterById(id!),
    enabled: id !== null,
  });
}
