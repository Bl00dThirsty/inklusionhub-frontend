import Image from "next/image";
import LevelBadge from "./LevelBadge";
import { Clock, CheckCircle } from "lucide-react";

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

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300">
      <div className="relative h-48 w-full mb-4">
       <Image
          src={course.coverImage}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          {course.language === "LSF Disponible" && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
              <CheckCircle size={12} />
              LSF Disponible
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
        <LevelBadge level={course.level} />
      </div>

      <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{course.lessons[0]?.duration || "4h"}</span>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {course.level.label}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

      <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        Voir les cours
      </button>
    </div>
  );
}