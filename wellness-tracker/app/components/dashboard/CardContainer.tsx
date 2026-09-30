const Card = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-xl border border-[#262A33] bg-[#181B22] p-4 sm:p-5 ${className}`}
    {...props}
  />
);
export default Card;
