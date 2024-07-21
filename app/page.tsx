import DealsList from '../components/DealsList';

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">HubSpot Deals Dashboard</h1>
      <DealsList />
    </main>
  );
}