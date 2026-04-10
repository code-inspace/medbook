import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updatePatient } from "../api/update-patient";
import type { Patient } from "../types/patient";

type UpdatePatientVariables = {
  id: string;
  firstName?: string;
  lastName?: string;
};

type Context = {
  previousPatients?: Patient[];
};

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient,
    Error,
    UpdatePatientVariables,
    Context
  >({
    mutationFn: updatePatient,

    async onMutate(variables) {
      // 1. Empêche un GET en cours d'écraser notre modification optimiste
      await queryClient.cancelQueries({
        queryKey: ["patients"],
      });

      // 2. Sauvegarde l'ancien cache
      const previousPatients =
        queryClient.getQueryData<Patient[]>(["patients"]);

      // 3. Modifie immédiatement le cache
      queryClient.setQueryData<Patient[]>(
        ["patients"],
        (patients) => {
          if (!patients) {
            return [];
          }

          return patients.map((patient) =>
            patient.id === variables.id
              ? {
                  ...patient,
                  ...variables,
                }
              : patient,
          );
        },
      );

      // 4. Retourne l'ancien cache pour pouvoir faire rollback
      return {
        previousPatients,
      };
    },

    // 5. Le serveur refuse → rollback
    onError(_error, _variables, context) {
      if (context?.previousPatients) {
        queryClient.setQueryData(
          ["patients"],
          context.previousPatients,
        );
      }
    },

    // 6. Dans tous les cas, resynchronise avec le serveur
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
  });
}