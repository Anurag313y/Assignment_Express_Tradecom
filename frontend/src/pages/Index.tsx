
import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Users, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import UserTable from "@/components/UserTable";
import Pagination from "@/components/Pagination";
import AddUserDialog from "@/components/AddUserDialog";
import UserDetailDialog from "@/components/UserDetailDialog";
import EmptyState from "@/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchUsers, deleteUser, User } from "@/lib/api";
import { toast } from "sonner";
import LoginForm from "@/components/LoginForm";
import { getToken, removeToken, verifyToken } from "@/lib/auth";

const LIMIT = 6;

export default function Index() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  // On mount, verify if existing token is still valid
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthenticated(false);
        setAuthChecking(false);
        return;
      }

      const user = await verifyToken();
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthChecking(false);
    };

    checkAuth();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers(page, LIMIT, debouncedSearch);
      setUsers(res.data);
      setTotal(res.total);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [load, isAuthenticated]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id.toString());
      toast.success(`${user.name} deleted`);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  const totalPages = Math.ceil(total / LIMIT);

  // Show a loading spinner while checking auth
  if (authChecking) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen gradient-bg">
      {/* Navbar with logout */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/70 backdrop-blur-xl">
        <div className="container flex min-h-[4rem] py-2 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-400 p-2 shadow-md shadow-primary/20">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate">
              User Management System
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="shrink-0 gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Users</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your team members and their account permissions.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {[
            { label: "Total Users", value: total },
            { label: "Admins", value: users.filter((u) => u.role === "Admin").length },
            { label: "This Page", value: users.length },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border bg-card/80 backdrop-blur-sm p-4 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5"
            >
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table or Empty */}
        {!loading && users.length === 0 ? (
          <EmptyState search={debouncedSearch} onAdd={() => setAddOpen(true)} />
        ) : (
          <UserTable
            users={users}
            loading={loading}
            onView={setDetailUser}
            onDelete={handleDelete}
          />
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        {/* Dialogs */}
        <AddUserDialog open={addOpen} onOpenChange={setAddOpen} onCreated={load} />
        <UserDetailDialog
          user={detailUser}
          open={!!detailUser}
          onOpenChange={(open) => !open && setDetailUser(null)}
        />
      </main>
    </div>
  );
}
