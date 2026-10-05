// Gestion des produits PLR (PRD §7.9)
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Package, ExternalLink, Trash2, Eye, EyeOff } from "lucide-react";
import { togglePublishProductAction, deleteProductAction } from "@/app/admin/actions";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const adminClient = createAdminClient();

  const { data: products } = await adminClient
    .from("products")
    .select(`
      id,
      title,
      slug,
      thumbnail_url,
      file_size_bytes,
      is_published,
      is_featured,
      created_at,
      categories:category_id (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Produits PLR</h1>
          <p className="text-sm text-muted">Gérez les ressources digitales et leur disponibilité</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background font-bold text-sm rounded-xl hover:bg-accent-dim transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-[#222222] bg-surface/50 overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-muted mx-auto mb-3" />
            <div className="font-display font-semibold text-lg mb-1">Aucun produit dans le catalogue</div>
            <p className="text-sm text-muted mb-4">Commencez par ajouter votre premier kit ou ebook PLR.</p>
            <Link
              href="/admin/produits/nouveau"
              className="inline-block px-5 py-2.5 bg-accent text-background font-bold text-sm rounded-xl"
            >
              Créer un produit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface2/60 text-xs text-muted uppercase border-b border-[#222222]">
                <tr>
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Taille</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {products.map((p: any) => {
                  const sizeMb = p.file_size_bytes
                    ? `${(p.file_size_bytes / (1024 * 1024)).toFixed(1)} Mo`
                    : "—";

                  return (
                    <tr key={p.id} className="hover:bg-surface2/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.thumbnail_url ? (
                            <img
                              src={p.thumbnail_url}
                              alt=""
                              className="w-12 h-12 object-cover rounded-lg bg-surface2 border border-[#222222]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-surface2 flex items-center justify-center text-muted">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-text">{p.title}</div>
                            <div className="text-xs text-muted">/{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {p.categories?.name || "Sans catégorie"}
                      </td>
                      <td className="px-6 py-4 text-muted font-mono text-xs">
                        {sizeMb}
                      </td>
                      <td className="px-6 py-4">
                        {p.is_published ? (
                          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
                            Publié
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/20">
                            Brouillon
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle publier */}
                          <form
                            action={async () => {
                              "use server";
                              await togglePublishProductAction(p.id, !p.is_published);
                            }}
                          >
                            <button
                              type="submit"
                              title={p.is_published ? "Dépublier" : "Publier"}
                              className="p-2 text-muted hover:text-text rounded-lg hover:bg-surface2 transition-colors"
                            >
                              {p.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </form>

                          {/* Supprimer */}
                          <form
                            action={async () => {
                              "use server";
                              await deleteProductAction(p.id);
                            }}
                          >
                            <button
                              type="submit"
                              title="Supprimer"
                              className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
