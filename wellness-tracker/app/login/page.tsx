'use client'
import * as React from 'react';
import {getUserInfoById} from '../api-helpers/user-api'
interface ILoginProps {
}

const Login: React.FunctionComponent<ILoginProps> = (props) => {

    const [userData, setUserData ] = React.useState<any>({})

    React.useEffect(() => {
        getUserInfoById('64a7f0e9c1d3b8e5f4a2b1c3').then(res => {
            setUserData(res.data)
        }).catch(err => console.log(err))
        console.log('userData', userData)
    }, [])
  return (
    <div>
        This is the login page aka /login
    </div>
  );
};

export default Login;
