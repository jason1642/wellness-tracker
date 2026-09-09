'use client'
interface IprojectDirectoryLayoutProps {
    children: React.ReactNode;
}
const dashboard: React.FunctionComponent<IprojectDirectoryLayoutProps> = ({children}) => {
  return (
    <section>
        {children}
    </section>
  );
};

export default dashboard;
