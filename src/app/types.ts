export interface DataForm {
  id: string;
  title: string;
  userId: string;
  content: string;
  isChecked: boolean;
  concern: string;
  image?: string | null;
  user?: UserData;
  comments?: number;
  likes?: {
    some: any;
    forEach: any;
    id: string;
    postId: string;
    userId: string;
  };
  countlikes?: number;
  countreports?: number;
  countseens?: number;
  createdAt?: string;
}

export interface FormProps {
  mode: "add" | "edit";
  initialData: DataForm;
  onCancel: () => void;
}

export interface UserData {
  id: string;
  name: string;
}

export interface NavData {
  name: string;
  setOpen: () => void;
}

export interface DisplayForm {
  currentUserId: string;
  onCancel: () => void;
}

export interface ViewPost {
  currentUserId: string;
  formData: DataForm;
  commentClicked: boolean;
  setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ViewData {
  id: string;
  title: string;
  userId: string;
  content: string;
  isChecked: boolean;
  concern: string;
  image?: string | null;
}

export interface CommentData {
  id: string;
  content: string;
  postId: string;
  user: { id: string; name: string };
  userId: string;
}
