export default function Card({ title, value }) {
  return (
    <div className="card">
      <h4 style={{ opacity: 0.7 }}>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}