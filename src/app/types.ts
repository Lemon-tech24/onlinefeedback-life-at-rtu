export interface DataForm {
  id: string;
  title: string;
  userId: string;
  content: string;
  isChecked: boolean;
  concern: string;
  image?: string | null;
  user?: UserData;
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
  postId: string;
  setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ViewData{
  id: string;
  title: string;
  userId: string;
  content: string;
  isChecked: boolean;
  concern: string;
  image?: string | null;
}