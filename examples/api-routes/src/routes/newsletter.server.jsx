import NewsletterForm from '../components/NewsletterForm.client';

export default function Index() {
  return (
    <>
      <NewsletterForm />
    </>
  );
}

export async function api(request) {
  // Read form JSON and return the email.
  const {email} = await request.json();
  return {email, status: 'subscribed'};
}
