export default function LoadingSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0F0F0F" }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: "#0B6B3A", borderTopColor: "transparent" }}
      />
    </div>
  );
}
