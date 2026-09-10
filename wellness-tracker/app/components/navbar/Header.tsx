"use client";
import * as React from "react";
import { verifyUser } from "../../api-helpers/user-api";
import { useRouter } from "next/navigation";
import Link from "next/link";

// eslint-disable-next-line
interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  // Add welcome back message with username if logged in, have nav buttons to user account if logged in
  // otherwise have login and signup buttons
  const [userData, setUserData] = React.useState();
  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();

    router.replace("/login");
  };

  const loginRedirect = () => {
    router.replace("/login");
  };
  React.useEffect(() => {
    verifyUser()
      .then((res) => {
        console.log("dashboardVerifyUser", res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("header", userData);
  }, []);

  return (
    <header className=" bg-[#111318] p-4 flex items-baseline justify-between">
      <div>
        <h1 className="text-white text-4xl">
          <Link href={"/"}>Zealthy</Link>
        </h1>
      </div>

      {userData ? (
        <button
          type="button"
          onClick={handleLogout}
          className="text-white text-3xl"
        >
          Log out
        </button>
      ) : (
        <button
          type="button"
          onClick={loginRedirect}
          className="text-white text-3xl"
        >
          Log in
        </button>
      )}
    </header>
  );
};

export default Header;
