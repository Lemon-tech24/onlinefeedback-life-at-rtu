import React, { ChangeEvent, useRef, useState } from "react";
import { EditPost } from "@/types";

const FormEdit = ({
  id,
  userId,
  content,
  image,
  isChecked,
  title,
  concern,
}: EditPost) => {
  const [imageBase64, setImageBase64] = useState<string | null>(image);
  const [currentImg, setImg] = useState<string | null>(image);
  const [imgError, setImageError] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [ntitle, setTitle] = useState<String>("");
  const [ncontent, setContent] = useState<String>("");
  const [npostAs, setPostAs] = useState<Boolean>(false);
  const [nconcern, setConcern] = useState<String>("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size > 3 * 1024 * 1024) {
      setImageError("File exceed maximum size: 3MB");
      return;
    }

    if (file) {
      try {
        if (file.type.startsWith("image/")) {
          setImg(URL.createObjectURL(file));
          const base64String = await convertToBase64(file);
          setImageBase64(base64String as string | null);
          setImageError("");
        } else {
          setImageError("Please select a valid image file.");
        }
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }
  };

  const convertToBase64 = async (file: File) => {
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
    setImg("");
    setImageBase64(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const SelectImage = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const FormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="">
        <form action="">
          <h1>Edit Mode</h1>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={title}
            required
          />
          <textarea
            defaultValue={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <div>
            <p>Post As</p>
            <input
              type="checkbox"
              defaultChecked={isChecked}
              onChange={(e) => setPostAs(e.target.checked)}
            />
          </div>

          <select
            defaultValue={concern}
            onChange={(e) => setConcern(e.target.value)}
          >
            <option value="">Please Select</option>
            <option value="facility">Facility</option>
            <option value="student">Student</option>
            <option value="etc">ETC</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={inputFileRef}
            className="hidden"
          />

          <button type="button" onClick={SelectImage}>
            Change Image
          </button>

          {currentImg && (
            <div className="relative">
              <button type="button" onClick={RemovePhoto} className="absolute">
                X
              </button>
              <img
                src={currentImg}
                className="max-h-full"
                alt="Selected Picture"
              />
            </div>
          )}

          <button type="submit">UPDATE POST</button>
        </form>
      </div>
    </>
  );
};

export default FormEdit;
