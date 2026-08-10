const TextField = ({ label, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#4A3226] mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-[#E9E1D3] bg-[#FBFAF6] px-4 py-3
                   text-[#4A3226] placeholder-[#B3A392]
                   focus:outline-none focus:border-[#6FA8C9] focus:ring-2 focus:ring-[#DCEBF3]
                   transition"
      />
    </div>
  );
};

export default TextField;