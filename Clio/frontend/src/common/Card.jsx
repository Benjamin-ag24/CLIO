const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-[#E9E1D3] shadow-sm p-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;