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
  currentUser: string;
  name: string;
  setOpen: () => void;
}

export interface DetailsForm {
  formData: DataForm;
  onCancel: () => void;
}

export interface DisplayForm {
  currentUserId: string;
  onCancel: () => void;
}
