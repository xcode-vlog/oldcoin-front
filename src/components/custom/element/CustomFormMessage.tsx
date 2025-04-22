import { FormMessage, useFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";

function PreSpacedFormMessage({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return <div className={cn("h-[20px]", className)}></div>;
  }
  return (
    <FormMessage {...props} className={className}>
      {props.children}
    </FormMessage>
  );
}

export { PreSpacedFormMessage };
