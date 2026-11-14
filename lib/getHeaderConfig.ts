import { unstable_cache } from 'next/cache';
import connectToDatabase from '@/lib/db';
import HeaderConfig from '@/models/HeaderConfig';

function normalize(doc: any) {
  const raw = doc && typeof doc.toObject === 'function' ? doc.toObject() : doc || {};

  const topBarRaw = raw.topBar || {};
  let messages: { text: string; link: string }[] = Array.isArray(topBarRaw.messages)
    ? topBarRaw.messages.map((m: any) => ({ text: m.text || '', link: m.link || '' }))
    : [];
  if (messages.length === 0 && topBarRaw.text) {
    messages = [{ text: topBarRaw.text, link: '' }];
  }

  const contactRaw = raw.contact || {};
  const logoRaw = raw.logo || {};
  const searchRaw = raw.search || {};
  const buttonRaw = raw.button || {};

  return {
    topBar: {
      enabled: topBarRaw.enabled ?? true,
      bgColor: topBarRaw.bgColor || '#3B82F6',
      textColor: topBarRaw.textColor || '#FFFFFF',
      autoSlide: topBarRaw.autoSlide ?? true,
      intervalSeconds: Number(topBarRaw.intervalSeconds) > 0 ? Number(topBarRaw.intervalSeconds) : 5,
      messages,
    },
    logo: {
      url: logoRaw.url || '/images/logo.webp',
      alt: logoRaw.alt || 'Logo',
      height: Number(logoRaw.height) > 0 ? Number(logoRaw.height) : 48,
    },
    menuItems: Array.isArray(raw.menuItems)
      ? raw.menuItems
          .map((item: any, index: number) => ({
            label: item.label || '',
            link: item.link || '',
            order: item.order ?? index,
            submenu: Array.isArray(item.submenu)
              ? item.submenu
                  .map((sub: any, subIndex: number) => ({
                    label: sub.label || '',
                    link: sub.link || '',
                    order: sub.order ?? subIndex,
                  }))
                  .sort((a: any, b: any) => a.order - b.order)
              : [],
          }))
          .sort((a: any, b: any) => a.order - b.order)
      : [],
    contact: {
      enabled: contactRaw.enabled ?? true,
      label: contactRaw.label ?? 'Need Help?',
      phone: contactRaw.phone || topBarRaw.phone || '',
      link: contactRaw.link || '',
    },
    search: { enabled: searchRaw.enabled ?? true },
    showCart: raw.showCart ?? true,
    button: {
      enabled: buttonRaw.enabled ?? true,
      label: buttonRaw.label || 'Login',
      link: buttonRaw.link || '/login',
      bgColor: buttonRaw.bgColor || '#111111',
      textColor: buttonRaw.textColor || '#FFFFFF',
    },
    accentColor: raw.accentColor || '#DF6951',
    spaceBelow: typeof raw.spaceBelow === 'number' && raw.spaceBelow >= 0 ? raw.spaceBelow : 40,
  };
}

const loadConfig = unstable_cache(
  async () => {
    await connectToDatabase();
    const config = await HeaderConfig.findOne();
    if (!config) return null;
    // Turn it into plain data so it can be passed to the page safely
    return JSON.parse(JSON.stringify(normalize(config)));
  },
  ['header-config'],
  { revalidate: 60 }
);

export async function getHeaderConfig() {
  try {
    return await loadConfig();
  } catch (error) {
    console.error('Header config load failed', error);
    return null;
  }
}
