"use client";
import * as React from "react";
import { getUserInfoById, loginUser } from "../api-helpers/user-api";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

// eslint-disable-next-line
interface ILoginProps {}
type Inputs = {
  email: string;
  password: string;
};

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  // eslint-disable-next-line
  // const [userData, setUserData ] = React.useState<any>({})

  // React.useEffect(() => {
  //     getUserInfoById('6aa19a6689663ea9f9604ebd').then(res => {
  //         console.log('useeffect', res)
  //         setUserData(res.data)
  //     }).catch(err => console.log(err))
  //     // console.log('userData', userData)
  // }, [])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    loginUser({
      email: data.email,
      password: data.password,
      username: "",
      bio: "",
    })
      .then((res) => {
        console.log("login success", res);
        router.push("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data);
  };
  console.log(watch("email"));

  //   after successful login renavigate to dashboard page and pass user data as props or use context to store user data and access it in dashboard page

  return (
    <div className="min-h-screen bg-[#111318] font-[Inter,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      {/* Header — same dark tone family as the rest of the app, just one shade darker to read as "chrome" */}

      <main className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-[720px] rounded-xl border border-[#262A33] bg-[#181B22] p-8">
          <h1 className="mb-1 text-2xl font-semibold text-[#F2F3F5]">Log in</h1>
          <p className="mb-6 text-sm text-[#8B92A1]">
            Welcome back — enter your details to continue.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col bg-zinc-800 p-4 rounded-lg gap-2 w-[80%] mx-auto"
          >
            <input
              {...register("email", { required: true })}
              placeholder="Email"
              className="w-full rounded-md border border-[#2C303A] bg-[#0F1116] px-3.5 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#5F6570] outline-none transition-colors focus:border-[#7FB8A0]"
            />
            {errors.email && <span>This field is required</span>}

            <input
              {...register("password", { required: true })}
              placeholder="Password"
              className="w-full rounded-md border border-[#2C303A] bg-[#0F1116] px-3.5 py-2.5 text-sm text-[#F2F3F5] placeholder:text-[#5F6570] outline-none transition-colors focus:border-[#7FB8A0]"
              type="password"
            />
            {errors.password && <span>This field is required</span>}

            <input type="submit" />
          </form>

          <p className="mt-6 text-center text-sm text-[#8B92A1]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#7FB8A0] hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
