export default function StatCard({ title, value }) {
  return (
    <div className="bg-cardBg p-4 rounded-xl">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  );
}