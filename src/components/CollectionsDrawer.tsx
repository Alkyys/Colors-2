import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Folder, X, Heart } from "lucide-react";
import PaletteCard from "./PaletteCard";
import { getLikedPalettes } from "@/lib/likes";

interface Collection {
  id: string;
  name: string;
  palettes: Array<{
    colors: Array<{
      hex: string;
      rgb: string;
      hsl: string;
    }>;
    isGradient: boolean;
    gradientDirection?: string;
    likes: number;
  }>;
}

interface CollectionsDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  collections?: Collection[];
}

const defaultCollections: Collection[] = [
  {
    id: "1",
    name: "Favorite Gradients",
    palettes: [
      {
        colors: [
          {
            hex: "#FF6B6B",
            rgb: "rgb(255, 107, 107)",
            hsl: "hsl(0, 100%, 71%)",
          },
          {
            hex: "#4ECDC4",
            rgb: "rgb(78, 205, 196)",
            hsl: "hsl(176, 56%, 55%)",
          },
        ],
        isGradient: true,
        gradientDirection: "45deg",
        likes: 42,
      },
      {
        colors: [
          {
            hex: "#A8E6CF",
            rgb: "rgb(168, 230, 207)",
            hsl: "hsl(151, 58%, 78%)",
          },
          {
            hex: "#FFD3B6",
            rgb: "rgb(255, 211, 182)",
            hsl: "hsl(27, 100%, 86%)",
          },
          {
            hex: "#FF8B94",
            rgb: "rgb(255, 139, 148)",
            hsl: "hsl(355, 100%, 77%)",
          },
        ],
        isGradient: false,
        likes: 28,
      },
    ],
  },
];

const defaultLikedPalettes = [
  {
    id: "liked-1",
    name: "Liked Palettes",
    palettes: [],
  },
];

const CollectionsDrawer = ({
  isOpen = true,
  onClose = () => {},
  collections = [...defaultLikedPalettes, ...defaultCollections],
}: CollectionsDrawerProps) => {
  const [likedPalettes, setLikedPalettes] = useState<any[]>([]);

  useEffect(() => {
    const loadLikedPalettes = async () => {
      try {
        const liked = await getLikedPalettes();
        setLikedPalettes(liked || []);
      } catch (error) {
        console.error("Error loading liked palettes:", error);
        setLikedPalettes([]);
      }
    };

    loadLikedPalettes();
  }, []);
  return (
    <Sheet open={isOpen}>
      <SheetContent side="right" className="w-[400px] p-0">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-gray-500" />
              <SheetTitle>Collections</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-full px-6 py-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Liked Palettes</h3>
            </div>
            <div className="space-y-4">
              {likedPalettes.map((like) => (
                <PaletteCard
                  key={like.palette_id}
                  colors={like.palettes?.palette_colors || []}
                  isGradient={like.palettes?.is_gradient || false}
                  gradientDirection={like.palettes?.gradient_direction}
                  likes={0}
                  isSaved={true}
                />
              ))}
              {likedPalettes.length === 0 && (
                <p className="text-gray-500 text-sm">No liked palettes yet</p>
              )}
            </div>
          </div>

          {collections.slice(1).map((collection) => (
            <div key={collection.id} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{collection.name}</h3>
              <div className="space-y-4">
                {collection.palettes.map((palette, index) => (
                  <PaletteCard
                    key={index}
                    colors={palette.colors}
                    isGradient={palette.isGradient}
                    gradientDirection={palette.gradientDirection}
                    likes={palette.likes}
                    isSaved={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CollectionsDrawer;
