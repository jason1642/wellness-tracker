'use client'
interface IprojectDirectoryLayoutProps {
    children: React.ReactNode;
}
const login: React.FunctionComponent<IprojectDirectoryLayoutProps> = ({children}) => {
  return (
    <section>
        {children}
    </section>
  );
};

export default login;
