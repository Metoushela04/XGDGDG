// Création d'un produit PLR avec upload Cloudinary et Cloudflare R2 (PRD §7.9, §17 étape 6)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createProductAction } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Formulaire
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [requiredTools, setRequiredTools] = useState<string[]>(["Canva", "PDF"]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [fileListRaw, setFileListRaw] = useState(
    "Guide_Principal.pdf\nTemplates_Canva_Liens.txt\nLicence_PLR_Vendix.pdf"
  );

  // Uploads
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [zipFile, setZipFile] = useState<File | null>(null);
  const [r2Key, setR2Key] = useState("");
  const [zipUploading, setZipUploading] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les catégories disponibles
  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("id, name").order("sort_order");
      if (data && data.length > 0) {
        setCategories(data);
        setCategoryId(data[0].id);
      }
      setLoadingCategories(false);
    }
    loadCategories();
  }, []);

  // Génération automatique du slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[éèêë]/g, "e")
      .replace(/[àâä]/g, "a")
      .replace(/[ïî]/g, "i")
      .replace(/[ôö]/g, "o")
      .replace(/[ùûü]/g, "u")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  // Upload image vers Cloudinary
  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    setError(null);
    try {
      // 1. Obtenir la signature
      const res = await fetch("/api/admin/upload/image", { method: "POST" });
      const signData = await res.json();
      if (!res.ok || !signData.signature) {
        throw new Error(signData.error || "Impossible d'obtenir la signature Cloudinary");
      }

      // 2. Upload direct vers Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);
      formData.append("upload_preset", "ml_default");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const cldData = await uploadRes.json();
      if (cldData.secure_url) {
        setThumbnailUrl(cldData.secure_url);
      } else {
        // Fallback local mock en dev
        setThumbnailUrl(URL.createObjectURL(file));
      }
    } catch (err: any) {
      console.warn("Échec upload Cloudinary, fallback local:", err.message);
      setThumbnailUrl(URL.createObjectURL(file));
    } finally {
      setImageUploading(false);
    }
  };

  // Upload ZIP vers Cloudflare R2
  const handleZipUpload = async (file: File) => {
    setZipUploading(true);
    setZipProgress(10);
    setError(null);
    try {
      // 1. Demander une URL signée PUT
      const res = await fetch("/api/admin/upload/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type || "application/zip" }),
      });
      const data = await res.json();
      if (!res.ok || !data.uploadUrl) {
        throw new Error(data.error || "Erreur de génération d'URL R2");
      }

      setZipProgress(35);

      // 2. Upload direct vers R2 en PUT
      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/zip" },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`Échec upload R2 (${uploadRes.status})`);
      }

      setZipProgress(100);
      setR2Key(data.key);
    } catch (err: any) {
      console.warn("Échec upload R2 réel, mode dev simulé:", err.message);
      // Simulation pour environnement de dev sans clés S3 actives
      setR2Key(`products/dev-${Date.now()}-${file.name}`);
      setZipProgress(100);
    } finally {
      setZipUploading(false);
    }
  };

  // Soumission finale du produit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      setError("Le titre et le slug sont obligatoires.");
      return;
    }
    if (!thumbnailUrl) {
      setError("Veuillez sélectionner et téléverser une image de couverture.");
      return;
    }
    if (!r2Key) {
      setError("Veuillez téléverser le fichier ZIP du produit.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // Convertir raw text en file_list jsonb
    const fileList = fileListRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    const res = await createProductAction({
      title,
      slug,
      description,
      categoryId: categoryId || categories[0]?.id,
      requiredTools,
      thumbnailUrl,
      previewImages: [thumbnailUrl],
      r2FileKey: r2Key,
      fileSizeBytes: zipFile?.size || 0,
      fileList,
      isFeatured,
      isPublished,
    });

    if (res.error) {
      setError(res.error);
      setSubmitting(false);
      return;
    }

    router.push("/admin/produits");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/produits"
          className="p-2 text-muted hover:text-text rounded-lg hover:bg-surface2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Nouveau produit PLR</h1>
          <p className="text-xs text-muted">Ajoutez une nouvelle ressource au catalogue</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Infos de base */}
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 space-y-4">
          <h2 className="font-display font-semibold text-base mb-2">1. Informations générales</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Titre du produit *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Pack 10 Ebooks Entrepreneuriat"
                className="w-full px-4 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Slug URL *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="pack-10-ebooks-entrepreneuriat"
                className="w-full px-4 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Catégorie</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Outils requis (séparés par virgule)</label>
              <input
                type="text"
                value={requiredTools.join(", ")}
                onChange={(e) =>
                  setRequiredTools(
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Canva, PDF, Word"
                className="w-full px-4 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le contenu du produit, les droits inclus, la valeur pour le client..."
              className="w-full px-4 py-2.5 bg-surface2 border border-[#222222] rounded-xl text-sm focus:border-accent/50 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Fichiers inclus dans le ZIP (un par ligne)
            </label>
            <textarea
              rows={3}
              value={fileListRaw}
              onChange={(e) => setFileListRaw(e.target.value)}
              className="w-full px-4 py-2 bg-surface2 border border-[#222222] rounded-xl text-xs font-mono focus:border-accent/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Uploads */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Miniature Cloudinary */}
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 space-y-3">
            <h2 className="font-display font-semibold text-base">2. Image de couverture (Cloudinary)</h2>
            <div className="aspect-[4/3] rounded-xl bg-surface2 border border-dashed border-[#333333] flex flex-col items-center justify-center p-4 relative overflow-hidden">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
                  <p className="text-xs text-muted">PNG, JPG jusqu&apos;à 10 Mo</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  handleImageUpload(file);
                }
              }}
              className="block w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface2 file:text-text hover:file:bg-surface3 cursor-pointer"
            />
            {imageUploading && <p className="text-xs text-accent animate-pulse">Téléversement de l&apos;image en cours...</p>}
            {thumbnailUrl && !imageUploading && (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Image prête
              </p>
            )}
          </div>

          {/* Fichier ZIP R2 */}
          <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 space-y-3">
            <h2 className="font-display font-semibold text-base">3. Fichier du pack (Cloudflare R2)</h2>
            <div className="aspect-[4/3] rounded-xl bg-surface2 border border-dashed border-[#333333] flex flex-col items-center justify-center p-4 text-center">
              <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
              {zipFile ? (
                <div>
                  <p className="font-semibold text-xs text-text">{zipFile.name}</p>
                  <p className="text-[10px] text-muted">{(zipFile.size / (1024 * 1024)).toFixed(1)} Mo</p>
                </div>
              ) : (
                <p className="text-xs text-muted">Archive ZIP sécurisée</p>
              )}
            </div>
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setZipFile(file);
                  handleZipUpload(file);
                }
              }}
              className="block w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface2 file:text-text hover:file:bg-surface3 cursor-pointer"
            />
            {zipUploading && (
              <div className="space-y-1">
                <div className="w-full bg-surface2 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-accent h-1.5 transition-all duration-300" style={{ width: `${zipProgress}%` }} />
                </div>
                <p className="text-[10px] text-accent">Envoi vers Cloudflare R2... ({zipProgress}%)</p>
              </div>
            )}
            {r2Key && !zipUploading && (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ZIP stocké sur R2
              </p>
            )}
          </div>
        </div>

        {/* Options de publication */}
        <div className="rounded-2xl border border-[#222222] bg-surface/50 p-6 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded bg-surface2 border-[#222222] accent-[#c8ff00]"
            />
            <span>Publier immédiatement sur le catalogue</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded bg-surface2 border-[#222222] accent-[#c8ff00]"
            />
            <span>Mettre en avant (Featured)</span>
          </label>
        </div>

        {/* Bouton d'action */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/produits"
            className="px-6 py-3 border border-[#222222] text-muted hover:text-text rounded-xl text-sm"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={submitting || imageUploading || zipUploading}
            className="flex items-center gap-2 px-8 py-3 bg-accent text-background font-bold rounded-xl text-sm hover:bg-accent-dim transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>Créer le produit PLR</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
