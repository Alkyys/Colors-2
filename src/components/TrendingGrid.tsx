import React, { useState, useEffect } from "react";
import { toggleLike, getLikeStatus } from "@/lib/likes";
import { getTrendingPalettes } from "@/lib/db";
import PaletteCard from "./PaletteCard";

interface TrendingGridProps {
  palettes?: Array<{
    id: string;
    colors: Array<{
      hex: string;
      rgb: string;
      hsl: string;
    }>;
    isGradient?: boolean;
    gradientDirection?: string;
    likes: number;
    isSaved: boolean;
  }>;
}

const defaultPalettes = [
  {
    id: "1",
    colors: [
      { hex: "#FF6B6B", rgb: "rgb(255, 107, 107)", hsl: "hsl(0, 100%, 71%)" },
      { hex: "#4ECDC4", rgb: "rgb(78, 205, 196)", hsl: "hsl(176, 56%, 55%)" },
      { hex: "#45B7D1", rgb: "rgb(69, 183, 209)", hsl: "hsl(192, 58%, 55%)" },
    ],
    isGradient: false,
    likes: 124,
    isSaved: false,
  },
  {
    id: "2",
    colors: [
      { hex: "#FF61D2", rgb: "rgb(255, 97, 210)", hsl: "hsl(314, 100%, 69%)" },
      { hex: "#FE9090", rgb: "rgb(254, 144, 144)", hsl: "hsl(0, 99%, 78%)" },
    ],
    isGradient: true,
    gradientDirection: "45deg",
    likes: 89,
    isSaved: true,
  },
  {
    id: "3",
    colors: [
      { hex: "#A8EB12", rgb: "rgb(168, 235, 18)", hsl: "hsl(82, 89%, 50%)" },
      { hex: "#4CB8C4", rgb: "rgb(76, 184, 196)", hsl: "hsl(185, 47%, 53%)" },
      { hex: "#3CD3AD", rgb: "rgb(60, 211, 173)", hsl: "hsl(164, 64%, 53%)" },
    ],
    isGradient: false,
    likes: 67,
    isSaved: false,
  },
  {
    id: "4",
    colors: [
      { hex: "#FFD93D", rgb: "rgb(255, 217, 61)", hsl: "hsl(49, 100%, 62%)" },
      { hex: "#FF6B6B", rgb: "rgb(255, 107, 107)", hsl: "hsl(0, 100%, 71%)" },
    ],
    isGradient: true,
    gradientDirection: "135deg",
    likes: 156,
    isSaved: false,
  },
  {
    id: "5",
    colors: [
      { hex: "#4158D0", rgb: "rgb(65, 88, 208)", hsl: "hsl(231, 63%, 54%)" },
      { hex: "#C850C0", rgb: "rgb(200, 80, 192)", hsl: "hsl(303, 53%, 55%)" },
      { hex: "#FFCC70", rgb: "rgb(255, 204, 112)", hsl: "hsl(40, 100%, 72%)" },
    ],
    isGradient: true,
    gradientDirection: "90deg",
    likes: 234,
    isSaved: true,
  },
  {
    id: "6",
    colors: [
      { hex: "#00F5A0", rgb: "rgb(0, 245, 160)", hsl: "hsl(157, 100%, 48%)" },
      { hex: "#00D9F5", rgb: "rgb(0, 217, 245)", hsl: "hsl(188, 100%, 48%)" },
    ],
    isGradient: true,
    gradientDirection: "60deg",
    likes: 178,
    isSaved: false,
  },
];

const TrendingGrid = ({ palettes = defaultPalettes }: TrendingGridProps) => {
  const handleSave = async (paletteId: string) => {
    const { count, userLiked } = await toggleLike(paletteId);
    // Force a re-render by updating the state
    setPalettes((current) =>
      current.map((p) =>
        p.id === paletteId ? { ...p, likes: count, isSaved: userLiked } : p,
      ),
    );
  };

  const [localPalettes, setPalettes] = useState(palettes);

  useEffect(() => {
    const loadPalettes = async () => {
      const trending = await getTrendingPalettes();
      const palettesWithLikes = await Promise.all(
        trending.map(async (palette) => ({
          ...palette,
          ...(await getLikeStatus(palette.id)),
        })),
      );
      setPalettes(palettesWithLikes);
    };
    loadPalettes();
  }, []);
  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {localPalettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              colors={palette.colors}
              isGradient={palette.isGradient}
              gradientDirection={palette.gradientDirection}
              likes={palette.likes}
              isSaved={palette.isSaved}
              onSave={() => handleSave(palette.id)}
              onShare={() => console.log(`Share palette ${palette.id}`)}
              onCopy={() => console.log(`Copy palette ${palette.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingGrid;
