import {
  toggleLikePalette,
  getLikedPalettes as fetchLikedPalettes,
} from "./db";

export interface LikeData {
  paletteId: string;
  count: number;
  userLiked: boolean;
}

export const toggleLike = async (paletteId: string): Promise<LikeData> => {
  const userLiked = await toggleLikePalette(paletteId);
  return { paletteId, count: userLiked ? 1 : -1, userLiked };
};

export const getLikedPalettes = async () => {
  return await fetchLikedPalettes();
};

export const getLikeStatus = async (paletteId: string): Promise<LikeData> => {
  const likes = await getLikedPalettes();
  const liked = likes.find((like) => like.palette_id === paletteId);
  return { paletteId, count: liked ? 1 : 0, userLiked: !!liked };
};
