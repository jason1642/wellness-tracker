import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://backend-production-acbe7.up.railway.app"
    : "http://localhost:3001";

const api = axios.create({ baseURL: baseUrl });

export const getTrackerByUserId = async (user_id: string) =>
  await api
    .get("/tracker/" + user_id)
    .then((res) => res)
    .catch((err) => err);

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

export const updateSingleEntryById = async (data) =>
  await api
    .put("/entry/edit", data)
    .then((res) => res)
    .catch((err) => err);
