import * as React from 'react';

interface IHeaderProps {
}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {


  // Add welcome back message with username if logged in, have nav buttons to user account if logged in 
  // otherwise have login and signup buttons
  return (
    <header className=" border-b border-gray-200 p-4 flex items-baseline justify-between"> 
    <div>
       <h1 className="text-white text-4xl">Zealthy</h1>
    </div>
   
   <div className="text-white text-3xl">
      second box
   </div>
        
    </header>
  );
};

export default Header;
