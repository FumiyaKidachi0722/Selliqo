// src/components/templates/Course/List/index.tsx

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLanguage } from '@/providers/LanguageProvider';
import { Course } from '@/types/course';

import styles from './List.module.css';

export const CourseListTemplate = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { currentLang } = useLanguage();

  const createLink = (path: string) => {
    return `/${currentLang}${path}`;
  };

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className={styles.listContainer}>
      <h1>コース一覧</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id} className={styles.courseItem}>
            <Link
              href={createLink(`/course/${course.id}`)}
              className={styles.courseLink}
            >
              <div>
                <h2 className={styles.courseTitle}>{course.name}</h2>
                <h3>{course.metadata.category}</h3>
                <p className={styles.courseDescription}>{course.description}</p>
                <p>価格: ¥{course.price.toLocaleString()}</p>
                <p>スケジュール: {course.metadata.schedule}</p>
                <p>講師: {course.metadata.teacher}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
