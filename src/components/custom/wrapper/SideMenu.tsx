import { Card, CardContent } from "@/components/ui/card";
import { PropsWithChildren } from "react";

function SideMenu({ children }: PropsWithChildren) {
  return (
    <Card className="w-[35%] h-[calc(100%-40px)] my-5 ">
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export { SideMenu };
