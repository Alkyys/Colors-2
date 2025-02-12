import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Share2, Heart, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

interface PaletteCardProps {
  colors?: Color[];
  isGradient?: boolean;
  gradientDirection?: string;
  likes?: number;
  isSaved?: boolean;
  onSave?: () => void;
  onShare?: () => void;
  onCopy?: () => void;
}

const defaultColors: Color[] = [
  { hex: "#FF6B6B", rgb: "rgb(255, 107, 107)", hsl: "hsl(0, 100%, 71%)" },
  { hex: "#4ECDC4", rgb: "rgb(78, 205, 196)", hsl: "hsl(176, 56%, 55%)" },
  { hex: "#45B7D1", rgb: "rgb(69, 183, 209)", hsl: "hsl(192, 58%, 55%)" },
];

const PaletteCard = ({
  colors = defaultColors,
  isGradient = false,
  gradientDirection = "90deg",
  likes = 0,
  isSaved = false,
  onSave = () => {},
  onShare = () => {},
  onCopy = () => {},
}: PaletteCardProps) => {
  const backgroundStyle = isGradient
    ? {
        background: `linear-gradient(${gradientDirection}, ${colors.map((c) => c.hex).join(", ")})`,
      }
    : {};

  return (
    <Card className="w-[300px] bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Preview Area */}
        <div className="h-40 w-full" style={backgroundStyle}>
          {!isGradient && (
            <div className="h-full w-full flex">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-full"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Color Information */}
        <div className="p-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="text-sm font-mono bg-gray-100 px-2 py-1 rounded"
              >
                {color.hex}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 border-t">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSave}
                  className={isSaved ? "text-red-500" : ""}
                >
                  <Heart
                    className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? "Remove from favorites" : "Add to favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm text-gray-500">{likes}</span>
        </div>

        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onCopy}>
                  <Copy className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy {isGradient ? "gradient" : "colors"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share palette</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaletteCard;
