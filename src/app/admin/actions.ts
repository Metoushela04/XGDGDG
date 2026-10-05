// Server Actions pour l'administration Vendix (PRD §7.9, §12)
"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAdmin } from "@/lib/access";

export async function createProductAction(formData: {
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  requiredTools: string[];
  thumbnailUrl: string;
  previewImages: string[];
  r2FileKey: string;
  fileSizeBytes: number;
  fileList: { name: string; size?: string; type?: string }[];
  isFeatured: boolean;
  isPublished: boolean;
}) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) {
    return { error: "Action non autorisée" };
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("products")
    .insert({
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      category_id: formData.categoryId,
      required_tools: formData.requiredTools,
      thumbnail_url: formData.thumbnailUrl,
      preview_images: formData.previewImages,
      r2_file_key: formData.r2FileKey,
      file_size_bytes: formData.fileSizeBytes,
      file_list: formData.fileList,
      is_featured: formData.isFeatured,
      is_published: formData.isPublished,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création produit:", error);
    return { error: error.message || "Erreur lors de la création du produit" };
  }

  // Audit log
  await adminClient.from("admin_audit_log").insert({
    admin_id: adminCheck.userId,
    action: "create_product",
    target: data.id,
  });

  revalidatePath("/admin/produits");
  revalidatePath("/dashboard/catalogue");
  revalidatePath("/catalogue-apercu");

  return { success: true, product: data };
}

export async function togglePublishProductAction(productId: string, isPublished: boolean) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) return { error: "Non autorisé" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("products")
    .update({ is_published: isPublished })
    .eq("id", productId);

  if (error) return { error: error.message };

  await adminClient.from("admin_audit_log").insert({
    admin_id: adminCheck.userId,
    action: isPublished ? "publish_product" : "unpublish_product",
    target: productId,
  });

  revalidatePath("/admin/produits");
  revalidatePath("/dashboard/catalogue");
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) return { error: "Non autorisé" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return { error: error.message };

  await adminClient.from("admin_audit_log").insert({
    admin_id: adminCheck.userId,
    action: "delete_product",
    target: productId,
  });

  revalidatePath("/admin/produits");
  revalidatePath("/dashboard/catalogue");
  return { success: true };
}

export async function createCategoryAction(name: string, slug: string, sortOrder = 0) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) return { error: "Non autorisé" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("categories")
    .insert({ name, slug, sort_order: sortOrder });

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/dashboard/catalogue");
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) return { error: "Non autorisé" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function toggleSuspendUserAction(userId: string, isSuspended: boolean) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) return { error: "Non autorisé" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ is_suspended: isSuspended })
    .eq("id", userId);

  if (error) return { error: error.message };

  await adminClient.from("admin_audit_log").insert({
    admin_id: adminCheck.userId,
    action: isSuspended ? "suspend_user" : "unsuspend_user",
    target: userId,
  });

  revalidatePath("/admin/utilisateurs");
  return { success: true };
}

export async function updateAppSettingAction(key: string, value: any) {
  const adminCheck = await checkAdmin();
  if (!adminCheck.isAdmin) return { error: "Non autorisé" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("app_settings")
    .upsert({ key, value });

  if (error) return { error: error.message };

  revalidatePath("/admin/parametres");
  return { success: true };
}
