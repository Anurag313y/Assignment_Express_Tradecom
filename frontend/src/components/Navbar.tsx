import { Users } from "lucide-react";

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-border/50 bg-card/70 backdrop-blur-xl">
    <div className="container flex h-16 items-center gap-3 px-4 sm:px-6">
      <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-400 p-2 shadow-md shadow-primary/20">
        <Users className="h-5 w-5 text-primary-foreground" />
      </div>
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        User Management System
      </h1>
    </div>
  </header>
);

export default Navbar;