// Server Actions pour le Dashboard membre Vendix (PRD §5, §7)
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Ajoute ou retire un produit des favoris de l'utilisateur connecté.
 */
export async function toggleFavoriteAction(productId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Non connecté" };
  }

  // Vérifier si déjà favori
  const { data: existing } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    // Retirer des favoris
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) return { error: error.message };
    revalidatePath("/dashboard/favoris");
    revalidatePath("/dashboard/catalogue");
    return { success: true, isFavorite: false };
  } else {
    // Ajouter aux favoris
    const { error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (error) return { error: error.message };
    revalidatePath("/dashboard/favoris");
    revalidatePath("/dashboard/catalogue");
    return { success: true, isFavorite: true };
  }
}
