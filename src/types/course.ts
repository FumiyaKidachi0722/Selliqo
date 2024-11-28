export interface Course {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  metadata: {
    category: string;
    schedule: string;
    teacher: string;
  };
}

export type Courses = Course[];
