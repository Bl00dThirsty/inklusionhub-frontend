interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl?: string;
}

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h4 className="font-semibold">{lesson.title}</h4>
      <p className="text-sm text-gray-500">{lesson.duration}</p>
    </div>
  );
}
