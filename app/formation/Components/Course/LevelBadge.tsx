interface Level {
  id: number;
  label: "Débutant" | "Intermédiaire" | "Avancé";
  color: string;
}

export default function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-white text-xs"
      style={{ backgroundColor: level.color }}
    >
      {level.label}
    </span>
  );
}
