"use client";
import * as React from "react";
import { verifyUser } from "../../api-helpers/user-api";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
// eslint-disable-next-line
interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  // Add welcome back message with username if logged in, have nav buttons to user account if logged in
  // otherwise have login and signup buttons

  const router = useRouter();
  const pathname = usePathname();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["currentUser", pathname],
    queryFn: () => verifyUser().then((res) => res.data),
  });

  const handleLogout = () => {
    localStorage.clear();

    router.replace("/login");
  };

  const loginRedirect = () => {
    router.replace("/login");
  };

  return (
    <header className="h-20 bg-[#111318] px-4 flex items-center justify-between">
      <div>
        <h1 className="text-white text-4xl leading-none">
          <Link href={"/"}>Zealthy</Link>
        </h1>
      </div>

      {isLoading ? (
        <div className="h-9 w-20 animate-pulse rounded-md bg-[#2c303a36]" />
      ) : userData ? (
        <button
          type="button"
          onClick={handleLogout}
          className="text-white text-3xl leading-none"
        >
          Log out
        </button>
      ) : (
        <button
          type="button"
          onClick={loginRedirect}
          className="text-white text-3xl leading-none"
        >
          Log in
        </button>
      )}
    </header>
  );
};

export default Header;
