// src/components/templates/Course/Detail/index.tsx

import { useEffect, useState } from 'react';

import { Course } from '@/types/course';

import styles from './Detail.module.css';

type CourseDetailTemplateProps = {
  id: string;
};

export const CourseDetailTemplate = ({ id }: CourseDetailTemplateProps) => {
  const [course, setCourse] = useState<Course | null>(null);

  const handlePurchase = async () => {
    if (!course) return;

    const lang = localStorage.getItem('language') || 'ja';

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: course.id,
          name: course.name,
          price: course.price,
          lang,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to retrieve Stripe Checkout URL');
      }
    } catch (error) {
      console.error('購入処理に失敗しました:', error);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        const data: Course = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.courseTitle}>{course.name}</h1>
      <p className={styles.courseDescription}>{course.description}</p>
      <p className={styles.coursePrice}>
        価格: \{course.price.toLocaleString()}
      </p>
      <p className={styles.courseSchedule}>
        スケジュール: {course.metadata.schedule}
      </p>
      <p className={styles.courseTeacher}>講師: {course.metadata.teacher}</p>
      <button onClick={handlePurchase} className={styles.purchaseButton}>
        購入する
      </button>
    </div>
  );
};
