const VARIANTS = {
  primary:
    "rounded-full bg-[#7fb3d1] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#6a9eb8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "rounded-full border border-[#e8ddd0] bg-white px-6 py-3 text-sm font-medium text-[#7b5f49] hover:bg-[#f7f2ec] transition-colors",
  danger:
    "rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors",
  text: "text-sm text-[#93816F] hover:text-[#5b3f2d] transition",
  accent:
    "rounded-full bg-[#BFD9E8] px-6 py-3 text-sm font-bold text-[#2F4858] hover:bg-[#A9CBDF] transition disabled:opacity-60 disabled:cursor-not-allowed",
};

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const style = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button className={`${style} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;