"use client";
import * as React from "react";
import { verifyUser } from "../../api-helpers/user-api";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// eslint-disable-next-line
interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  // Add welcome back message with username if logged in, have nav buttons to user account if logged in
  // otherwise have login and signup buttons
  const [userData, setUserData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    localStorage.clear();

    router.replace("/login");
  };

  const loginRedirect = () => {
    router.replace("/login");
  };
  React.useEffect(() => {
    // eslint-disable-next-line
    setIsLoading(true);

    verifyUser()
      .then((res) => {
        console.log("dashboardVerifyUser", res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
        setUserData(undefined);
      })
      .finally(() => {
        setIsLoading(false);
      });
    console.log("HEADER useffect render", userData);
  }, [pathname]);

  return (
    <header className=" bg-[#111318] p-4 flex items-baseline justify-between">
      <div>
        <h1 className="text-white text-4xl">
          <Link href={"/"}>Zealthy</Link>
        </h1>
      </div>

      {isLoading ? (
        <div className="h-9 w-16" />
      ) : userData ? (
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
