import { LarpAttendanceStatus } from "../types";
import LarpAPI from "../util/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFetchLarp(id: number) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["larps", id],
    queryFn: () => LarpAPI.getLarpById(id),
  });
  return {
    larp: data ?? null,
    loading: isLoading,
    error: error ? [error.message] : [],
  };
}

export function useLarpAttendance(id: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["larps", id, "attendance"],
    queryFn: () => LarpAPI.getLarpAttendanceById(id),
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn(status: LarpAttendanceStatus) {
      if (status === data?.attendance) {
        status = "none";
      }
      return LarpAPI.attendLarp(id, status);
    },
    onSuccess(data) {
      queryClient.setQueryData(["larps", id, "attendance"], data);
    },
  });

  return {
    attendance: data,
    update: mutate,
    isLoading,
    isPending,
  };
}
