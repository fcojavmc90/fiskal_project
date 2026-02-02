import { redirect } from 'next/navigation';

export default function ClientBookingByProPage({ params }: { params: { proId: string } }) {
  redirect(`/book/${params.proId}`);
}
