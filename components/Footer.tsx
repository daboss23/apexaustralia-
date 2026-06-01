export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-5 py-12 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-bold tracking-[0.16em]">
            T<span className="text-red">·</span>APEX <span className="text-red/70">AUSTRALIA</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/40">
            Intelligent resistance training technology for elite performance environments.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-white/50">
          <a href="#technology" className="hover:text-red">Technology</a>
          <a href="#how" className="hover:text-red">How It Works</a>
          <a href="#product" className="hover:text-red">Product</a>
          <a href="#australia" className="hover:text-red">Australia</a>
          <a href="#contact" className="hover:text-red">Book Demo</a>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/5 pt-6 font-mono text-[11px] tracking-[0.15em] text-white/30 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} T-APEX AUSTRALIA</span>
        <span>SPEED · FORCE · POWER · DATA</span>
      </div>
    </footer>
  );
}
