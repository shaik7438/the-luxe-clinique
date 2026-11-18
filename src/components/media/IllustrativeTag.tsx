/** Small, honest label for AI-generated imagery so it is never mistaken for real clients or results. */
export default function IllustrativeTag({ className = "absolute bottom-3 right-3" }: { className?: string }) {
  return (
    <span className={`pointer-events-none z-[1] rounded-full bg-white/70 px-2.5 py-0.5 text-[10.5px] font-medium tracking-wide text-muted backdrop-blur-md ${className}`}>
      Illustrative image
    </span>
  );
}
