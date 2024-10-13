// src/components/templates/Course/List/index.tsx

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLanguage } from '@/hooks/useLanguage';
import { Course } from '@/types/course';

import styles from './List.module.css';

export const CourseListTemplate = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { currentLang } = useLanguage();

  const createLink = (path: string) => {
    if (path === '/') return path;
    return `/${currentLang}${path}`;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch('/data/courses.json');
      const data = await response.json();
      setCourses(data);
    };
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
                <p className={styles.courseDescription}>{course.description}</p>
                <p>価格: ¥{course.price.toLocaleString()}</p>
                <p>スケジュール: {course.schedule}</p>
                <p>講師: {course.teacher}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
