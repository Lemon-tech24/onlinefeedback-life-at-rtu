export interface PostData {
  id: string;
  userId: string;
  user: User;
  content: string;
  image: string | null;
  isChecked: boolean;
  title: string;
  concern: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface EditPost {
  id: string;
  userId: string;
  content: string;
  image: string | null;
  isChecked: boolean;
  title: string;
  concern: string;
}
