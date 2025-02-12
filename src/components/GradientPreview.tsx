import React from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Copy } from "lucide-react";

interface GradientPreviewProps {
  colors?: string[];
  gradientType?: "linear" | "radial";
  angle?: number;
  cssCode?: string;
}

const GradientPreview = ({
  colors = ["#FF5F6D", "#FFC371"],
  gradientType = "linear",
  angle = 45,
  cssCode = "linear-gradient(45deg, #FF5F6D 0%, #FFC371 100%)",
}: GradientPreviewProps) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(cssCode);
  };

  const gradientStyle = {
    background:
      gradientType === "linear"
        ? `linear-gradient(${angle}deg, ${colors.join(", ")})`
        : `radial-gradient(circle, ${colors.join(", ")})`,
  };

  return (
    <div className="w-full max-w-[440px] bg-card p-4 rounded-lg shadow-md">
      <div className="relative">
        <div className="h-[200px] w-full rounded-lg" style={gradientStyle} />
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
      <div className="mt-2 px-2">
        <code className="text-sm text-gray-600 break-all">{cssCode}</code>
      </div>
    </div>
  );
};

export default GradientPreview;
