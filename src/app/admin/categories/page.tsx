// Gestion des catégories (PRD §7.9, §12)
import { createAdminClient } from "@/lib/supabase/admin";
import { FolderTree, Trash2 } from "lucide-react";
import { createCategoryAction, deleteCategoryAction } from "@/app/admin/actions";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const adminClient = createAdminClient();

  const { data: categories } = await adminClient
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Catégories du catalogue</h1>
        <p className="text-sm text-muted">Organisez les formats de produits PLR</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Formulaire d'ajout */}
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 md:col-span-1 h-fit">
          <h2 className="font-display font-semibold text-base mb-4">Ajouter une catégorie</h2>
          <form
            action={async (formData: FormData) => {
              "use server";
              const name = formData.get("name") as string;
              const slug = formData.get("slug") as string;
              const sortOrder = Number(formData.get("sort_order")) || 0;
              if (name && slug) {
                await createCategoryAction(name, slug, sortOrder);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Nom *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ex: Templates Notion"
                className="w-full px-3.5 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                required
                placeholder="templates-notion"
                className="w-full px-3.5 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Ordre d&apos;affichage</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={0}
                className="w-full px-3.5 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-accent text-background font-bold text-sm rounded-xl hover:bg-accent-dim transition-all"
            >
              Enregistrer
            </button>
          </form>
        </div>

        {/* Liste des catégories existantes */}
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 md:col-span-2">
          <h2 className="font-display font-semibold text-base mb-4">Catégories existantes</h2>
          {!categories || categories.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">Aucune catégorie pour le moment.</p>
          ) : (
            <div className="divide-y divide-[#222222]">
              {categories.map((c: any) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-accent">
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-text">{c.name}</div>
                      <div className="text-xs text-muted font-mono">/{c.slug}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">Ordre : {c.sort_order}</span>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCategoryAction(c.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
