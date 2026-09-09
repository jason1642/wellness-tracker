'use client'
import * as React from 'react';
import {getUserInfoById, loginUser} from '../api-helpers/user-api'
import { useForm, SubmitHandler } from 'react-hook-form';

interface ILoginProps {
}
type Inputs = {
  email: string
  password: string
}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
    const [userData, setUserData ] = React.useState<any>({})




    React.useEffect(() => {
        getUserInfoById('6aa19a6689663ea9f9604ebd').then(res => {
            console.log('useeffect', res)
            setUserData(res.data)
        }).catch(err => console.log(err))
        // console.log('userData', userData)
    }, [])

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        loginUser({email: data.email, password: data.password, username: '', bio: ''}).then(res => {
            console.log('login res', res)
        }).catch(err => console.log(err))    
        console.log(data)
    }
      console.log(watch("email")) 


    //   after successful login renavigate to dashboard page and pass user data as props or use context to store user data and access it in dashboard page

  return (
        <div className="bg-grey border border-white p-4 rounded-lg">

            <h2>Log In</h2>
            <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col bg-zinc-800 p-4 rounded-lg gap-2 "
            >
                <input {...register("email", { required: true })} placeholder="Email" />
                {errors.email && <span>This field is required</span>}
                
                <input {...register("password", { required: true })} placeholder="Password" />
                {errors.password && <span>This field is required</span>}
                
                <input type="submit" />
            </form>            

            <div>
                Don't have an account?  <a href="/register" className="text-blue-500">Sign Up Here</a>
            </div>
        </div>
  );
};

export default Login;
