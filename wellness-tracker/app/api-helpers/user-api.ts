import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://backend-production-acbe7.up.railway.app"
    : "http://localhost:3001";
const api = axios.create({ baseURL: baseUrl });

interface UserInput {
  username: string;
  password: string;
  email: string;
  bio: string;
}

// input should be  {username, password, email}
export const createUser = async (input: UserInput) =>
  await api
    .post("/users/create", input)
    .then((res) => {
      // console.log(res)
      // window.location.reload();
      localStorage.setItem("authToken", res.data.token);
      api.defaults.headers.common.authorization = `Bearer ${res.data.token}`;
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

export const getUserInfoById = async (user_id: string) =>
  await api
    .get("/users/" + user_id)
    .then((res) => res)
    .catch((err) => err);

//   export const getTrackerData = async (user_id: string) =>
//     await api.get()

export const loginUser = async (input: UserInput) =>
  api
    .post("/auth/login", input)
    .then((res) => {
      console.log(res.data);

      localStorage.setItem("authToken", res.data.token);
      api.defaults.headers.common.authorization = `Bearer ${res.data.token}`;
      console.log(localStorage);
      return res;
    })
    .catch((err) => {
      // console.log('CANNOT LOG IN')
      return err;
    });

// Verify user - get full user info after checking token

export const verifyUser = async () => {
  const token = localStorage.getItem("authToken");
  return api
    .post("/auth/verify", { token: token })
    .then((res) => {
      console.log("verify user res", res);
      return res;
    })
    .catch((err) => {
      console.log("verify user err", err);
      return err;
    });
};

// logout
export const removeToken = async (user_id: { user_id: string }) => {
  // Accepts type string, number, boolean
  // await api.post('/user/log-out', user_id).then(res=>console.log('logged out'))
  api.defaults.headers.common.authorization = false;
};
