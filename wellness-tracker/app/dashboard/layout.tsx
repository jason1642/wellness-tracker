"use client";
interface IprojectDirectoryLayoutProps {
  children: React.ReactNode;
}
const dashboard: React.FunctionComponent<IprojectDirectoryLayoutProps> = ({
  children,
}) => {
  return <section className="bg-[#111318]">{children}</section>;
};

export default dashboard;
