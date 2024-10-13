'use client';
// src/app/[lang]/course/[id]/page.tsx

import { useParams } from 'next/navigation';

import { CourseDetailTemplate } from '@/components/templates/Course/Detail';

const CourseDetailPage = () => {
  const params = useParams();
  const { id } = params;

  // 必要な場合、ローディング状態を追加で管理できます
  if (!id) {
    return <div>Loading...</div>;
  }

  return <CourseDetailTemplate id={id.toString()} />;
};

export default CourseDetailPage;
