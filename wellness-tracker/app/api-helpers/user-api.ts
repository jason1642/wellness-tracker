import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://zealthy.vercel.app/api' : 'http://localhost:3001';
const api = axios.create({baseURL: baseUrl})

interface UserInput {
  username: string,
  password: string,
  email: string,
  bio: string
}

// input should be  {username, password, email}
export const createUser = async (input:UserInput) => 
  await api.post('/users/create', input)
    .then(res => {
    // console.log(res)
      // window.location.reload();
      return res
    }).catch(err => {
    console.log(err)
    return err;
  });

  export const getUserInfoById = async (user_id:string) => 
  await api.get('/users/' + user_id).then(res=> res).catch(err=>err)


//   export const removeToken = async(user_id: {user_id: string}) => {
//     // Accepts type string, number, boolean
//     await api.post('/user/log-out', user_id).then(res=>console.log('logged out'))
//     api.defaults.headers.common.authorization = false;
//   };