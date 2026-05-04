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
      {Array.from({ length: 5 }).map((_, i) => (
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
    <div className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 sm:px-6 py-3.5 text-left font-medium text-muted-foreground whitespace-nowrap">Name</th>
              <th className="hidden px-4 sm:px-6 py-3.5 text-left font-medium text-muted-foreground sm:table-cell whitespace-nowrap">Email</th>
              <th className="px-4 sm:px-6 py-3.5 text-left font-medium text-muted-foreground whitespace-nowrap">Role</th>
              <th className="px-4 sm:px-6 py-3.5 text-right font-medium text-muted-foreground whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="group border-b last:border-0 transition-colors hover:bg-muted/30 cursor-pointer"
                onClick={() => onView(user)}
              >
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-accent-foreground text-xs">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 sm:px-6 py-4 text-muted-foreground sm:table-cell truncate">{user.email}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" className={roleBadgeClass[user.role]}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => { e.stopPropagation(); onView(user); }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={(e) => { e.stopPropagation(); onDelete(user); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}