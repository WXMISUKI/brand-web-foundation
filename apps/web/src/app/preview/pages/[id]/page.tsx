import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false, follow: false },
};

/**
 * Minimal preview route for CMS draft pages.
 *
 * The CMS admin "Preview" button opens this URL with a draft token.
 * This Server Component fetches the page via CMS REST API and renders
 * basic fields. Security is minimal (token-existence check only) —
 * harden before public deployment.
 */
export default async function PreviewPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const token = typeof search.token === 'string' ? search.token : undefined;

  const cmsUrl = process.env.CMS_URL || 'http://localhost:3001';

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-lg text-red-600">
          Preview token is missing. Open this page from the CMS admin.
        </p>
      </main>
    );
  }

  try {
    const res = await fetch(`${cmsUrl}/api/pages/${id}?draft=true&depth=0`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return (
        <main className="flex min-h-screen items-center justify-center p-8">
          <p className="text-lg text-red-600">
            Failed to load preview (HTTP {res.status}).
          </p>
        </main>
      );
    }

    const page = await res.json();

    return (
      <main className="mx-auto max-w-3xl p-8">
        <div className="mb-4 rounded-md bg-amber-100 px-4 py-2 text-sm text-amber-800">
          ⚠ Preview Mode — this content is not published.
        </div>
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {page.excerpt && (
          <p className="mt-4 text-lg text-gray-600">{page.excerpt}</p>
        )}
        {page.slug && (
          <p className="mt-2 text-sm text-gray-400">slug: /{page.slug}</p>
        )}
      </main>
    );
  } catch {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-lg text-red-600">
          Cannot reach CMS at {cmsUrl}. Is the CMS dev server running?
        </p>
      </main>
    );
  }
}
