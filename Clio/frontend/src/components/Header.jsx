const Header = () => {
  return (
    <header className="bg-[#f7f2ec] px-6 py-4 border-b border-[#e8ddd0]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo + Nombre */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e7dc] shadow-sm border border-[#e8ddd0] overflow-hidden">
            {/* Reemplaza aquí con tu imagen de logo */}
            <img
              src="logo.png"
              alt="Logo Clio"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-[#5b3f2d] tracking-tight">
            Clio
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
