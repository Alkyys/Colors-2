import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import GradientPreview from "./GradientPreview";
import { RefreshCcw, Plus, Minus } from "lucide-react";

interface ColorPickerPanelProps {
  onColorChange?: (colors: string[]) => void;
  onGradientTypeChange?: (type: "linear" | "radial") => void;
  onAngleChange?: (angle: number) => void;
  initialColors?: string[];
  initialType?: "linear" | "radial";
  initialAngle?: number;
}

const ColorPickerPanel = ({
  onColorChange = () => {},
  onGradientTypeChange = () => {},
  onAngleChange = () => {},
  initialColors = ["#FF5F6D", "#FFC371"],
  initialType = "linear",
  initialAngle = 45,
}: ColorPickerPanelProps) => {
  const [colors, setColors] = useState<string[]>(initialColors);
  const [gradientType, setGradientType] = useState<"linear" | "radial">(
    initialType,
  );
  const [angle, setAngle] = useState(initialAngle);

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
    onColorChange(newColors);
  };

  const handleAddColor = () => {
    if (colors.length < 5) {
      setColors([...colors, "#000000"]);
    }
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      onColorChange(newColors);
    }
  };

  const handleTypeChange = (value: string) => {
    const newType = value as "linear" | "radial";
    setGradientType(newType);
    onGradientTypeChange(newType);
  };

  const handleAngleChange = (value: number[]) => {
    setAngle(value[0]);
    onAngleChange(value[0]);
  };

  const cssCode =
    gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${colors.join(", ")})`
      : `radial-gradient(circle, ${colors.join(", ")})`;

  return (
    <Card className="w-full max-w-[480px] bg-white">
      <CardContent className="p-6 space-y-6">
        <GradientPreview
          colors={colors}
          gradientType={gradientType}
          angle={angle}
          cssCode={cssCode}
        />

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 mt-4">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-grow">
                  <Label htmlFor={`color-${index}`}>Color {index + 1}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id={`color-${index}`}
                      type="color"
                      value={color}
                      className="w-12 h-10 p-1"
                      onChange={(e) => handleColorChange(index, e.target.value)}
                    />
                    <Input
                      type="text"
                      value={color}
                      className="font-mono"
                      onChange={(e) => handleColorChange(index, e.target.value)}
                    />
                  </div>
                </div>
                {colors.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveColor(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {colors.length < 5 && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={handleAddColor}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Color
              </Button>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label>Gradient Type</Label>
                <TabsList className="grid w-full grid-cols-2 mt-1">
                  <TabsTrigger
                    value="linear"
                    onClick={() => handleTypeChange("linear")}
                    className={gradientType === "linear" ? "bg-primary" : ""}
                  >
                    Linear
                  </TabsTrigger>
                  <TabsTrigger
                    value="radial"
                    onClick={() => handleTypeChange("radial")}
                    className={gradientType === "radial" ? "bg-primary" : ""}
                  >
                    Radial
                  </TabsTrigger>
                </TabsList>
              </div>

              {gradientType === "linear" && (
                <div className="space-y-2">
                  <Label>Angle: {angle}°</Label>
                  <Slider
                    value={[angle]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={handleAngleChange}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="mt-2"
                    onClick={() => handleAngleChange([45])}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ColorPickerPanel;
