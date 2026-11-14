import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeaderConfig from '@/models/HeaderConfig';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  let logoUrl = '/images/logo.webp';

  // Read the logo that was uploaded from the dashboard
  try {
    await connectToDatabase();
    const config: any = await HeaderConfig.findOne().lean();
    if (config?.logo?.url) logoUrl = config.logo.url;
  } catch (error) {
    console.error('Favicon: could not read logo from database', error);
  }

  const absoluteUrl = logoUrl.startsWith('http')
    ? logoUrl
    : logoUrl.startsWith('//')
    ? `https:${logoUrl}`
    : `${origin}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;

  try {
    const res = await fetch(absoluteUrl, { cache: 'no-store' });
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': res.headers.get('content-type') || 'image/png',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }
  } catch (error) {
    console.error('Favicon: could not load logo image', error);
  }

  // Fallback if the logo cannot be loaded
  return NextResponse.redirect(`${origin}/images/logo.webp`);
}
