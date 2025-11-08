export default function GlowButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full pulse-glow transition"
    >
      {children}
    </button>
  );
}