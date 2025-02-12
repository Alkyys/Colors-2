import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface WearablePreviewProps {
  colors: Array<{
    hex: string;
    rgb: string;
    hsl: string;
  }>;
  isGradient?: boolean;
  gradientDirection?: string;
}

const WearablePreview = ({
  colors,
  isGradient = false,
  gradientDirection = "90deg",
}: WearablePreviewProps) => {
  const getGradientOrColor = (colorIndex: number) => {
    if (isGradient) {
      return `linear-gradient(${gradientDirection}, ${colors.map((c) => c.hex).join(", ")})`;
    }
    return colors[colorIndex]?.hex || "#000000";
  };

  const cssCode = `/* Clothing CSS */
.outfit {
  /* Top */
  background-color: ${colors[0]?.hex};
  
  /* Bottom */
  border-color: ${colors[1]?.hex};
  
  /* Accessories */
  color: ${colors[2]?.hex};
}`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(cssCode);
  };

  return (
    <Card className="w-full max-w-[440px]">
      <CardContent className="p-6 space-y-6">
        <div className="relative aspect-[3/4] w-full bg-muted/20 rounded-lg overflow-hidden">
          {/* Outfit Preview */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Top/Shirt */}
            <div
              className="w-3/4 h-1/3 rounded-lg mb-4"
              style={{ background: getGradientOrColor(0) }}
            />

            {/* Bottom/Pants */}
            <div
              className="w-2/3 h-1/2 rounded-lg"
              style={{ background: getGradientOrColor(1) }}
            />

            {/* Accessories (shown as a belt) */}
            {colors[2] && (
              <div
                className="w-2/3 h-2 -mt-[60%]"
                style={{ background: getGradientOrColor(2) }}
              />
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                  onClick={handleCopyClick}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy CSS</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-4 bg-muted/10 rounded-lg">
          <h3 className="font-medium mb-2">Suggested Combination:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Top: {colors[0]?.hex}</li>
            <li>• Bottom: {colors[1]?.hex}</li>
            {colors[2] && <li>• Accessories: {colors[2]?.hex}</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WearablePreview;
