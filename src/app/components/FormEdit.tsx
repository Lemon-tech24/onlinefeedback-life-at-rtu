import React, { ChangeEvent, useRef, useState } from "react";
import { EditPost } from "@/types";
import axios from "axios";

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
  const [isFormChanged, setFormChanged] = useState(false);

  const handleInputChange = () => {
    setFormChanged(true);
  };

  const FormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id)
      try {
        const response = await axios.post("/api/post/edit", {
          id: id,
          image: imageBase64,
          title: ntitle,
          content: ncontent,
          isChecked: npostAs,
          concern: nconcern,
        });
        setFormChanged(false);
        const data = response.data;
        console.log(data);
      } catch (err) {
        console.log("Updating Failed", err);
      }
  };

  return (
    <>
      <div className="">
        <form action="">
          <h1>Edit Mode</h1>
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
              handleInputChange();
            }}
            defaultValue={title}
            required
          />
          <textarea
            defaultValue={content}
            onChange={(e) => {
              setContent(e.target.value);
              handleInputChange();
            }}
            required
          ></textarea>
          <div>
            <p>Post As</p>
            <input
              type="checkbox"
              defaultChecked={isChecked}
              onChange={(e) => {
                setPostAs(e.target.checked);
                handleInputChange();
              }}
            />
          </div>

          <select>
            <option value="">Please Select</option>
            <option value="facility">Facility</option>
            <option value="student">Student</option>
            <option value="etc">ETC</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImageChange(e);
              handleInputChange();
            }}
            ref={inputFileRef}
            className="hidden"
          />

          <button type="button" onClick={SelectImage}>
            Change Image
          </button>

          {currentImg && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  RemovePhoto();
                  handleInputChange();
                }}
                className="absolute"
              >
                X
              </button>
              <img
                src={currentImg}
                className="max-h-full"
                alt="Selected Picture"
              />
            </div>
          )}

          <button
            type="submit"
            className=""
            style={{
              cursor: !isFormChanged ? "not-allowed" : "default",
              opacity: !isFormChanged ? 0.7 : 1,
            }}
            disabled={!isFormChanged}
          >
            UPDATE POST
          </button>
        </form>
      </div>
    </>
  );
};

export default FormEdit;
