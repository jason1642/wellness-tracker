"use client";
import { useQuery } from "@tanstack/react-query";
import { verifyUser } from "./api-helpers/user-api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      verifyUser()
        .then((res) => res.data)
        .catch(() => null),
    staleTime: 5 * 60 * 1000,
  });
}
