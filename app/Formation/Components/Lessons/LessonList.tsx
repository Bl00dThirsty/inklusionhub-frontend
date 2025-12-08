
import LessonCard from "./LessonCard";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl?: string;
}
export default function LessonList({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="mt-4 space-y-3">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
