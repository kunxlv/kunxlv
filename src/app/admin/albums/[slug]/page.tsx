import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { fetchStored } from "@/lib/albums";
import { AdminFrame, AlbumEditor } from "../../admin-ui";

export default function EditAlbumPage({ params }: PageProps<"/admin/albums/[slug]">) {
  return (
    <Suspense fallback={<AdminFrame signedIn>{null}</AdminFrame>}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { slug } = await params;
  if (slug === "new") return <AdminFrame signedIn><AlbumEditor album={null} isNew /></AdminFrame>;
  const album = ((await fetchStored()) ?? []).find((a) => a.slug === slug);
  if (!album) notFound();
  return <AdminFrame signedIn><AlbumEditor key={slug} album={album} isNew={false} /></AdminFrame>;
}
