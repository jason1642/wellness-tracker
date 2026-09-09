'use client'
import * as React from 'react';
import {getUserInfoById} from '../api-helpers/user-api'
import { useForm, SubmitHandler } from 'react-hook-form';

interface IRegisterProps {
}
type Inputs = {
  email: string
  password: string
}

const Register: React.FunctionComponent<IRegisterProps> = (props) => {
    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
    const [userData, setUserData ] = React.useState<any>({})




    React.useEffect(() => {
    
        console.log('userData', userData)
    }, [])

    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
      console.log(watch("email")) 

  return (
        <div className="bg-grey border border-white p-4 rounded-lg">

            <h2>Create an account</h2>
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
                Already have an account?<a href="/login" className="text-blue-500">Log In Here</a>
            </div>
        </div>
  );
};

export default Register;
