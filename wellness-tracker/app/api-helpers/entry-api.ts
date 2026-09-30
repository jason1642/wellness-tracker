import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : "http://localhost:3001";

const api = axios.create({ baseURL: baseUrl });

export const getEntriesByUserId = async (user_id: string) =>
  await api
    .get("/entry/" + user_id)
    .then((res) => res)
    .catch((err) => err);

export const createNewEntry = async (data) =>
  await api
    .post(`/entry/${data.user_id}`, data)
    .then((res) => res)
    .catch((err) => err);

export const deleteEntry = async (data) =>
  await api
    .delete(`/entry/delete/${data.entry_id}`, { data: data })
    .then((res) => res)
    .catch((err) => err);

export const updateSingleEntryById = async (data) =>
  await api.patch("/entry", data).then((res) => res);

export const getSleepDataByUserId = async (user_id: string) =>
  await api.get(`/sleep_data/${user_id}`);
