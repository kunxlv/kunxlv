import { Suspense } from "react";
import { connection } from "next/server";
import { authConfigured, isAdmin } from "@/lib/admin-auth";
import { fetchStored, storageReady } from "@/lib/albums";
import { sampleAlbums } from "@/content/albums";
import { AdminFrame, AlbumList, Notice, SignInForm } from "./admin-ui";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminFrame signedIn={false}>{null}</AdminFrame>}>
      <AdminHome />
    </Suspense>
  );
}

async function AdminHome() {
  await connection(); // read env and cookies per request, not at build time
  if (!authConfigured()) {
    return (
      <AdminFrame signedIn={false}>
        <Notice title="Set an admin password first">Add an environment variable called <code>ADMIN_PASSWORD</code> to this project in Vercel, then redeploy. That password signs you in here.</Notice>
      </AdminFrame>
    );
  }
  if (!(await isAdmin())) return <AdminFrame signedIn={false}><SignInForm /></AdminFrame>;
  const stored = storageReady() ? await fetchStored().catch(() => null) : null;
  return (
    <AdminFrame signedIn>
      <AlbumList albums={stored ?? sampleAlbums} usingSamples={!stored} storage={storageReady()} />
    </AdminFrame>
  );
}
