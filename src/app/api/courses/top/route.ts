// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';

import stripe from '@/services/stripe';
import { Courses } from '@/types/course';

export async function GET() {
  try {
    const courses = await stripe.products.list({
      expand: ['data.default_price'],
    });

    const formattedCourses: Courses = courses.data.map((course) => {
      const { id, name, description, images, metadata, default_price } = course;

      const getPrice = (
        price: string | { unit_amount?: number } | null
      ): number => {
        return typeof price === 'object' &&
          price !== null &&
          'unit_amount' in price
          ? (price.unit_amount ?? 0)
          : 0;
      };

      return {
        id,
        name,
        description: description || '',
        image: images[0] || '',
        price: getPrice(default_price),
        metadata: {
          category: metadata.category || '',
          schedule: metadata.schedule || '',
          teacher: metadata.teacher || '',
        },
      };
    });

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
