"use client";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function useFetch(
  queryKey,
  url,
  params = undefined,
  options = {},
) {
  const fetchData = async () => {
    const res = await api.get(`${url}`, { params });
    return res.data;
  };
  return useQuery({
    queryKey: [queryKey, url, params],
    queryFn: fetchData,
    ...options,
  });
}
