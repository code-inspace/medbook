import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancelAppointment,
  getAppointments,
  scheduleAppointment,
} from "../api/appointments";

const APPOINTMENTS_KEY = ["appointments"];

export function useAppointments() {
  return useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: getAppointments,
    retry: false,
  });
}

export function useScheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleAppointment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY }),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY }),
  });
}
