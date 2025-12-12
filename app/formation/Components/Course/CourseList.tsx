
import CourseCard from "./CourseCard";

interface Level {
  id: number;
  label: "Débutant" | "Intermédiaire" | "Avancé";
  color: string;
}

interface Instructor {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  language: string;
  level: Level;
  instructor: Instructor;
  lessons: Lesson[];
}
export default function CourseList({ courses }: { courses: Course[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
