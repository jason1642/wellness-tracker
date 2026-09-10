import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://zealthy.vercel.app/api"
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

export const updateSingleEntryById = async (data) =>
  await api
    .put("/entry", data)
    .then((res) => res)
    .catch((err) => err);
