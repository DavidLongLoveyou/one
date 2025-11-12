import { notFound } from 'next/navigation';
import { WebVitals } from '@/components/performance/WebVitals';

const locales = ['en', 'vi'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <>
      <WebVitals />
      {children}
    </>
  );
}

