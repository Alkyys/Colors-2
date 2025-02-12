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
      try {
        const trending = await getTrendingPalettes();
        const palettesWithLikes = await Promise.all(
          trending.map(async (palette) => {
            const likeStatus = await getLikeStatus(palette.id);
            return {
              id: palette.id,
              colors: palette.palette_colors.map((color) => ({
                hex: color.hex,
                rgb: color.rgb,
                hsl: color.hsl,
              })),
              isGradient: palette.is_gradient,
              gradientDirection: palette.gradient_direction,
              likes: palette.likes_count?.[0]?.count || 0,
              isSaved: likeStatus.userLiked,
            };
          }),
        );
        setPalettes(palettesWithLikes);
      } catch (error) {
        console.error("Error loading trending palettes:", error);
      }
    };
    loadPalettes();
  }, []);

  return (
    <div className="w-full bg-muted/50 p-6">
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
