
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
import {
  AUTH_SESSION_EXPIRED_EVENT,
  fetchUsers,
  deleteUser,
  User,
} from "@/lib/api";
import { toast } from "sonner";
import LoginForm from "@/components/LoginForm";
import { getToken, removeToken, verifyToken } from "@/lib/auth";

const LIMIT = 3;

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

  useEffect(() => {
    const onSessionExpired = (e: Event) => {
      const detail = (e as CustomEvent<{ notify?: boolean }>).detail;
      const notify = detail?.notify !== false;
      setIsAuthenticated(false);
      setAuthChecking(false);
      setLoading(false);
      if (notify) {
        toast.info("Session expired. Please sign in again.");
      }
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    return () =>
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

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
      let currentPage = page;
      let res = await fetchUsers(currentPage, LIMIT, debouncedSearch);
      const lastPage = Math.max(1, Math.ceil(res.total / LIMIT));

      // Avoid empty table when page is past the last page (e.g. after deleting users or changing page size).
      if (res.total > 0 && currentPage > lastPage) {
        currentPage = lastPage;
        setPage(lastPage);
        res = await fetchUsers(currentPage, LIMIT, debouncedSearch);
      } else if (res.total > 0 && res.data.length === 0 && currentPage > 1) {
        currentPage = 1;
        setPage(1);
        res = await fetchUsers(1, LIMIT, debouncedSearch);
      }

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

      <main className="container max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10 animate-fade-in">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Users</h2>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Manage your team members, roles, and account permissions in one centralized dashboard.
          </p>
        </div>

        {/* Toolbar: Robust Responsive Layout */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card/40 border-border/40 focus:bg-card transition-all rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button 
            onClick={() => setAddOpen(true)}
            className="h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            <Plus className="mr-2 h-5 w-5" /> Add User
          </Button>
        </div>

        {/* Stats Grid: Professional 1-2-3 column layout */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {[
            { label: "Total Users", value: total, icon: Users, color: "text-blue-500" },
            { label: "Admins", value: users.filter((u) => u.role === "Admin").length, icon: Users, color: "text-purple-500" },
            { label: "Active This Page", value: users.length, icon: Users, color: "text-emerald-500" },
          ].map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-soft transition-all hover:shadow-card hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{s.label}</p>
                  <p className="mt-2 text-3xl font-black text-foreground">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Empty only when there are no users for this query (not when current page is out of range). */}
        {!loading && total === 0 ? (
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
