import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

export function ProductDisplay() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Wireless Headphones</CardTitle>
          <Badge variant="secondary">New</Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          High-fidelity audio with noise cancellation
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <AspectRatio ratio={4 / 3} className="bg-muted rounded-md overflow-hidden">
          <img
            src="https://placecats.com/300/225"
            alt="Wireless Headphones"
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <p className="mt-4 text-xl font-semibold">$199.99</p>
      </CardContent>

      <CardFooter className="p-4 pt-2">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}