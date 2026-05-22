export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_oklch(0.85_0.15_220/0.6)]" />
        <span className="text-sm tracking-[0.3em] uppercase font-medium">[Your Name]</span>
      </div>
      <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.25em] text-muted-foreground pointer-events-auto">
        <a href="#" className="hover:text-foreground transition-colors">Vision</a>
        <a href="#" className="hover:text-foreground transition-colors">Ventures</a>
        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
      </nav>
      <button className="glass pointer-events-auto px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-foreground/10 transition-all">
        Connect
      </button>
    </header>
  );
}
