import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  search: string;
  onAdd: () => void;
}

export default function EmptyState({ search, onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Users className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {search ? "No users found" : "No users yet"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {search
          ? `No results for "${search}". Try a different search term.`
          : "Get started by adding your first user to the system."}
      </p>
      {!search && (
        <Button className="mt-6" onClick={onAdd}>
          Add First User
        </Button>
      )}
    </div>
  );
}