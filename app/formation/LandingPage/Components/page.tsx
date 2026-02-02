import Header from "@/app/Components/Header";
import CourseList from "./Course/CourseList";
import Footer from "@/app/Components/Footer";
import FormationLayout from "./Course/FormLayout";
import LearningProgress from "./Course/LaerningProgress";
import QuizSection from "./Quiz/QuizSection";

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

interface Quiz {
  id: number;
  courseId: number;
  title: string;
  questions: { id: number; question: string; options: string[]; correctAnswer: number }[];
}

// --- fake data for demo ---
const level = { id: 1, label: "Débutant" as const, color: "#3b82f6" };

const instructor = {
  id: 1,
  name: "Alice Dupont",
  avatar: "/images/teacher.png",
  specialty: "Langue des Signes Française",
};

const courseList = [
  {
    id: 1,
    title: "LSF - Les Bases",
    description: "Apprenez les fondamentaux de la LSF.",
    coverImage: "/images/sg.png",
    language: "LSF Disponible",
    level,
    instructor,
    lessons: [
      { id: 1, title: "Introduction à la LSF", duration: "4h" },
    ],
  },
  {
    id: 2,
    title: " Les Bases du Developpement Personnel",
    description: "Developpement personnel.",
    coverImage: "/images/per.jpg",
    language: "LSF Disponible",
    level,
    instructor,
    lessons: [
      { id: 1, title: "Introduction au Developpement Personnel", duration: "4h" },
    ],
  },
  {
    id: 3,
    title: " Les Bases du Marketing Digital",
    description: "Marketing digital.",
    coverImage: "/images/mark.jpg",
    language: "LSF Disponible",
    level,
    instructor,
    lessons: [
      { id: 1, title: "Introduction au Marketing Digital", duration: "4h" },
    ],
  },
  {
    id: 4,
    title: "Les Bases de la Comptabilité",
    description: "Apprenez les fondamentaux de la comptabilité.",
    coverImage: "/images/comptabilite.jpg",
    language: "LSF Disponible",
    level,
    instructor,
    lessons: [
      { id: 1, title: "Introduction aux Bases de la Comptabilité", duration: "4h" },
    ],
  },
  {
    id: 5,
    title: "Cours d'anglais pour débutants",
    description: "Apprenez les fondamentaux d'anglais.",
    coverImage: "/images/anglais.jpg",
    language: "LSF Disponible",
    level,
    instructor,
    lessons: [
      { id: 1, title: "Introduction au cours d'anglais", duration: "4h" },
    ],
  },
  {
    id: 6,
    title: "Cours de mathématiques pour débutants",
    description: "Apprenez les fondamentaux des mathématiques.",
    coverImage: "/images/maths.jpg",
    language: "LSF Disponible",
    level,
    instructor,
    lessons: [
      { id: 1, title: "Introduction aux mathématiques", duration: "4h" },
    ],
  },
];

const quizData: Quiz = {
  id: 1,
  courseId: 1,
  title: "Quiz - LSF Débutant",
  questions: [
    {
      id: 1,
      question: "Quel est le signe pour Bonjour ?",
      options: ["A", "B", "C", "D"],
      correctAnswer: 0,
    },
  ],
};

export default function FormationPage() {
  return (
    <div>
        <Header />
        
        <FormationLayout>
    <div className="max-w-6xl mx-auto px-4 py-10">
      <CourseList courses={courseList} />
        <QuizSection/>
        <LearningProgress />
    </div>
    </FormationLayout>
    <Footer />
    </div>
  );
}
