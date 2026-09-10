"use client";
import * as React from "react";
import { verifyUser } from "./api-helpers/user-api";
import { useRouter } from "next/navigation";

export default function Home() {
  // Add welcome back message with username if logged in, have nav buttons to user account if logged in
  // otherwise have login and signup buttons
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    verifyUser()
      .then((res) => {
        console.log("dashboardVerifyUser", res.data);
        if (res.data) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        router.replace("/login");
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-[#32323e]">
        Loading...
      </div>
    );
  }

  return null;
}
