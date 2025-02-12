import { supabase } from "./supabase";

export async function createPalette({
  name,
  colors,
  isGradient,
  gradientDirection,
}: {
  name?: string;
  colors: Array<{ hex: string; rgb: string; hsl: string }>;
  isGradient: boolean;
  gradientDirection?: string;
}) {
  const { data: palette, error: paletteError } = await supabase
    .from("palettes")
    .insert({
      name,
      is_gradient: isGradient,
      gradient_direction: gradientDirection,
    })
    .select()
    .single();

  if (paletteError) throw paletteError;

  const colorInserts = colors.map((color, index) => ({
    palette_id: palette.id,
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
    position: index,
  }));

  const { error: colorsError } = await supabase
    .from("palette_colors")
    .insert(colorInserts);

  if (colorsError) throw colorsError;

  return palette;
}

export async function getPalette(id: string) {
  const { data: palette, error: paletteError } = await supabase
    .from("palettes")
    .select("*")
    .eq("id", id)
    .single();

  if (paletteError) throw paletteError;

  const { data: colors, error: colorsError } = await supabase
    .from("palette_colors")
    .select("*")
    .eq("palette_id", id)
    .order("position");

  if (colorsError) throw colorsError;

  return { ...palette, colors };
}

export async function getTrendingPalettes() {
  const { data: palettes, error: palettesError } = await supabase
    .from("palettes")
    .select(
      `
      *,
      palette_colors (*),
      likes (count)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (palettesError) throw palettesError;

  return palettes;
}

export async function toggleLikePalette(paletteId: string) {
  const { data: existingLike, error: checkError } = await supabase
    .from("likes")
    .select("*")
    .eq("palette_id", paletteId)
    .single();

  if (checkError && checkError.code !== "PGRST116") throw checkError;

  if (existingLike) {
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("palette_id", paletteId);

    if (deleteError) throw deleteError;
    return false;
  } else {
    const { error: insertError } = await supabase
      .from("likes")
      .insert({ palette_id: paletteId });

    if (insertError) throw insertError;
    return true;
  }
}

export async function getLikedPalettes() {
  const { data: likes, error } = await supabase.from("likes").select(`
      palette_id,
      palettes (
        *,
        palette_colors (*)
      )
    `);

  if (error) throw error;

  return likes;
}
