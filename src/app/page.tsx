import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  const token = cookies().get('wn_token');
  if (token) redirect('/inbox');
  redirect('/login');
}