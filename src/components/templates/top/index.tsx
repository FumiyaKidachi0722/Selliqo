// src/components/templates/TopTemplate.tsx

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Courses } from '@/types/course';

import styles from './TopTemplate.module.css';

export const TopTemplate = () => {
  const [courses, setCourses] = useState<Courses>([]);

  // データを外部から取得
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses/top');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  if (!courses.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>おすすめコース</h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {courses.map((course) => (
          <SwiperSlide key={course.id}>
            <div className={styles.courseCard}>
              <img
                src={course.image || 'images/no-image.webp'}
                alt={course.name}
                className={styles.image}
              />
              <h3 className={styles.title}>{course.name}</h3>
              <p className={styles.description}>{course.description}</p>
              <p className={styles.price}>
                価格: ¥{course.price.toLocaleString()}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
