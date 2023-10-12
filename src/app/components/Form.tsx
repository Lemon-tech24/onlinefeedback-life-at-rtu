import { FormProps, DataForm } from "@/app/types";
import axios from "axios";
import React, { ChangeEvent, useState, useRef } from "react";
import { FaUserSecret } from "react-icons/fa6";
import { BiImageAdd } from "react-icons/bi";

const Form: React.FC<FormProps> = ({ mode, initialData, onCancel }) => {
  //success
  const [success, setSuccess] = useState<boolean | null>(null);

  //notif
  const [notif, setNotif] = useState<string>("");

  //checkbox ref
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  //form data
  const [formData, setFormData] = useState<DataForm>(initialData);

  //watch event if changes happens in values
  const [event, setEvent] = useState<boolean>(false);
  //const [currentImg, setImg] = useState<string | null>(formData.image ?? null); for displaying image

  //notif for image
  const [imgError, setImageError] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  //handle Changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (mode === "edit") {
      if (e) {
        setEvent(true);
      }
    }
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckBox = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = !checkboxRef.current.checked;
      const checked = checkboxRef.current.checked;
      setFormData((prevData) => ({
        ...prevData,
        isChecked: checked,
      }));
      setEvent(true);
    }
  };

  //Images related Here
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === "edit") {
      if (e) {
        setEvent(true);
      }
    }

    const file = e.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size <= 3 * 1024 * 1024) {
          try {
            const base64String = await convertToBase64(file);
            setFormData((prev) => ({
              ...prev,
              image: base64String as string | null,
            }));
            setImageError("");
          } catch (error) {
            console.error("Error converting image to base64:", error);
          }
        } else {
          setImageError("File exceeds the maximum size of 3MB");
          RemovePhoto();
        }
      } else {
        setImageError("Please select a valid image file.");
        RemovePhoto();
      }
    }
  };

  const convertToBase64 = async (file: File) => {
    if (file) {
      setEvent(true);
    }
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const RemovePhoto = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
    setEvent(true);
  };

  //end of handle Changes

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    if (mode === "add") {
      const response = await axios.post("/api/post/add", {
        formData: formData,
      });

      const data = response.data;

      if (data.success) {
        setSuccess(true);
        setNotif("Successfully Posted");

        setTimeout(() => {
          setNotif("");
          onCancel();
        }, 1200);
      } else {
        setSuccess(false);
        setNotif("Failed To Post");

        setTimeout(() => {
          setNotif("");
        }, 1200);
      }
    }

    if (mode === "edit") {
      const response = await axios.post("/api/post/edit", {
        formData: formData,
      });
    }

    setFormData(initialData);
    RemovePhoto();
  };

  return (
    <div className="w-1/2 h-screen flex items-center justify-center fixed top-0 right-0 z-40 bg-slate-500">
      {notif && <p>{notif}</p>}
      <div>
        {imgError && <p>{imgError}</p>}
        <div>
          <button type="button" onClick={() => onCancel()}>
            Cancel
          </button>
        </div>

        {/*------------------------------------------------------*/}

        <form onSubmit={handleSubmit}>
          {/*TITLE */}
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="title"
            onChange={handleChange}
            maxLength={100}
            required
          />
          {/*CONTENT*/}
          <textarea
            placeholder="Let your voice be heard."
            name="content"
            value={formData.content}
            onChange={handleChange}
            maxLength={500}
            required
          />

          {/*CONCERN*/}
          <select
            onChange={handleChange}
            value={formData.concern}
            name="concern"
            required
          >
            <option value="">Please Select</option>
            <option value="facility">Facility</option>
            <option value="student">Student</option>
            <option value="professor">Professor</option>
            <option value="etc">ETC</option>
          </select>

          {/* POST AS ANONYMOUS */}
          <input
            type="checkbox"
            name="isChecked"
            ref={checkboxRef}
            className="hidden"
            defaultChecked={formData.isChecked}
          />
          <button
            type="button"
            onClick={handleCheckBox}
            style={{ color: checkboxRef.current?.checked ? "black" : "white" }}
          >
            <FaUserSecret />
          </button>
          {/*IMAGE */}

          <div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={inputFileRef}
              className="hidden"
            />

            <button type="button" onClick={() => inputFileRef.current?.click()}>
              <BiImageAdd />
            </button>
            {formData.image && (
              <button type="button" onClick={RemovePhoto}>
                X
              </button>
            )}
          </div>

          <button type="submit">
            {mode === "edit" ? "Save Post" : "Add Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
