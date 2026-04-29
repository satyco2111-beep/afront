export default function ServiceCard({ title, desc }) {
  return (
    <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition bg-white">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}