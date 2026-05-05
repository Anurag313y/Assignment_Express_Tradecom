import { User } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const roleBadgeClass: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  Editor: "bg-amber-50 text-amber-600 border-amber-200",
  Viewer: "bg-muted text-muted-foreground border-border",
};

interface Props {
  users: User[];
  loading: boolean;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function UserTable({ users, loading, onView, onDelete }: Props) {
  if (loading) return <UserTableSkeleton />;

  return (
    <div className="w-full">
      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:grid md:grid-cols-[2fr_2fr_1fr_120px] gap-4 px-6 py-3 border-b border-border/50 bg-muted/20 rounded-t-2xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
        <div>Name</div>
        <div>Email</div>
        <div>Role</div>
        <div className="text-right">Actions</div>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col gap-4 md:gap-0 md:divide-y md:divide-border/40 md:border md:border-border/50 md:rounded-b-2xl md:bg-card/50 md:backdrop-blur-sm overflow-hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="group relative flex flex-col md:grid md:grid-cols-[2fr_2fr_1fr_120px] md:items-center gap-4 p-5 md:px-6 md:py-4 bg-card md:bg-transparent border md:border-none border-border/50 rounded-2xl md:rounded-none shadow-soft md:shadow-none hover:bg-primary/[0.03] transition-all"
            onClick={() => onView(user)}
          >
            {/* Column 1: Name */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="h-12 w-12 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-background md:ring-1 md:ring-border/30" />
                ) : (
                  <div className="flex h-12 w-12 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm md:text-xs">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground text-base md:text-sm truncate">{user.name}</p>
                <p className="md:hidden text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
              </div>
            </div>

            {/* Column 2: Email (Desktop Only) */}
            <div className="hidden md:block text-sm text-muted-foreground truncate">
              {user.email}
            </div>

            {/* Column 3: Role */}
            <div className="flex items-center justify-between md:block">
              <span className="md:hidden text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tight">Role</span>
              <Badge variant="outline" className={`${roleBadgeClass[user.role]} font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-lg`}>
                {user.role}
              </Badge>
            </div>

            {/* Column 4: Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 md:pt-0 border-t md:border-none border-border/40">
              <Button
                variant="secondary"
                size="sm"
                className="md:hidden flex-1 h-10 rounded-xl font-bold text-xs gap-2"
                onClick={(e) => { e.stopPropagation(); onView(user); }}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-opacity md:opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); onView(user); }}
                >
                  <Eye className="h-4.5 w-4.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 md:h-9 md:w-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive md:opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); onDelete(user); }}
                >
                  <Trash2 className="h-5 w-5 md:h-4.5 md:w-4.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}