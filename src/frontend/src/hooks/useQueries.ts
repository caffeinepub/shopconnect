import { useQuery } from "@tanstack/react-query";
// Legacy query hooks — kept for compatibility but not used by current UI.
// The shop queries are in useShopQueries.ts.
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<{ name: string } | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}
