import { Card, CardContent } from "@/components/ui/card";
import { PropsWithChildren } from "react";

function MainContent({ children }: PropsWithChildren) {
  return (
    <Card className="w-[65%] h-[calc(100%-40px)] my-5 ">
      <CardContent className="h-full">{children}</CardContent>
    </Card>
  );
}

export { MainContent };
