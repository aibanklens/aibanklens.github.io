// Server component — provides generateStaticParams for static export
import BankDetailClient from './BankDetailClient';
import { BANKS } from '@/types';

export function generateStaticParams() {
  return BANKS.map(bank => ({ slug: encodeURIComponent(bank) }));
}

export default function BankDetailPage({ params }: { params: { slug: string } }) {
  return <BankDetailClient slug={params.slug} />;
}
