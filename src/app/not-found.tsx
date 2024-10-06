import Link from "next/link";
import Button from "./_ui/_content/button";
import { Card, CardContent } from "./_ui/_content/card";
import NotFoundBox from "@/app/_ui/_assets/_svgs/not-found-box.svg";

export default function NotFound() {
  return (
      <main className="min-h-screen">
        <Card fabric="iron" className="max-w-screen-sm mx-auto mt-4 sm:mt-8">
            <CardContent className="flex flex-col gap-2 items-center">
                <NotFoundBox className="size-12 fill-paper/70" />
                <h5 className="text-center text-paper">
                    Not Found (404)
                </h5>
                <p className="text-center text-paper mb-4">We could not find the resource you requested.</p>
                <Link href="/">
                  <Button fabric="papyrus" size="xl">Home</Button>            
                </Link>
            </CardContent>
        </Card>
        
      </main>
  );
}
