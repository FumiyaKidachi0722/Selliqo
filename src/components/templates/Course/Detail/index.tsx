// src/components/templates/Course/Detail/index.tsx

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Course } from '@/types/course';
import styles from './Detail.module.css';

type CourseDetailTemplateProps = {
  id: string;
};

export const CourseDetailTemplate = ({ id }: CourseDetailTemplateProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const { isLoggedIn, stripeCustomerId } = useAuthStore();

  const handlePurchase = async () => {
    if (!isLoggedIn || !stripeCustomerId) {
      alert('購入するにはログインが必要です');
      return;
    }

    const lang = localStorage.getItem('language') || 'ja';

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: course?.id,
          lang,
          stripeCustomerId,
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
    if (!id) {
      // IDがない場合は早期リターンして何もレンダリングしない
      setCourse(null);
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }
        const data: Course = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      }
    };

    fetchCourse();
  }, [id]);

  // IDが空の場合は何もレンダリングしない
  if (!id) {
    return null;
  }

  // コースデータがまだ読み込まれていない場合はローディングメッセージを表示
  if (!course) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.courseTitle}>{course.name}</h1>
      <p className={styles.courseDescription}>{course.description}</p>
      <p className={styles.coursePrice}>
        価格: ¥{course.price.toLocaleString()}
      </p>
      <p className={styles.courseSchedule}>
        スケジュール: {course.metadata.schedule}
      </p>
      <p className={styles.courseTeacher}>講師: {course.metadata.teacher}</p>
      <button
        onClick={handlePurchase}
        className={styles.purchaseButton}
        disabled={!isLoggedIn}
      >
        購入する
      </button>
      {!isLoggedIn && (
        <p style={{ color: 'red' }}>ログインすると購入できます</p>
      )}
    </div>
  );
};
