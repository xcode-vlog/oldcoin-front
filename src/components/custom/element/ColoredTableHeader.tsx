import { TableHeader } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
}

function ColoredTableHeader({ className, children }: Props) {
  return (
    <TableHeader
      className={cn(
        "[&>tr>th]:bg-gray-300",
        "[&>tr>th]:first:rounded-tl-md [&>tr>th]:last:rounded-tr-md",
        { className }
      )}
    >
      {children}
    </TableHeader>
  );
}

export { ColoredTableHeader };
