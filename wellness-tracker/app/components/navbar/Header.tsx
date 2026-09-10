import * as React from "react";
// eslint-disable-next-line
interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  // Add welcome back message with username if logged in, have nav buttons to user account if logged in
  // otherwise have login and signup buttons
  return (
    <header className=" bg-[#111318] p-4 flex items-baseline justify-between">
      <div>
        <h1 className="text-white text-4xl">Zealthy</h1>
      </div>

      <div className="text-white text-3xl">Log out</div>
    </header>
  );
};

export default Header;
