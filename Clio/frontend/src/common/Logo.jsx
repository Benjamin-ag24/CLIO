const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-[#F1DFC0] flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 38 38" fill="none">
          <path d="M4 8C9 6 14 6 19 9V30C14 27 9 27 4 29V8Z" fill="#B08355" />
          <path d="M34 8C29 6 24 6 19 9V30C24 27 29 27 34 29V8Z" fill="#8C6239" />
          <path d="M19 9V30" stroke="#5C4234" strokeWidth="1.4" />
        </svg>
      </div>
      <span
        className="text-3xl font-bold text-[#4A3226]"
        style={{ fontFamily: "serif" }}
      >
        Clio
      </span>
    </div>
  );
};

export default Logo;