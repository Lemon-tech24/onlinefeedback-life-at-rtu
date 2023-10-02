"use client";
import axios from "axios";
import React, { useState, useRef, ChangeEvent } from "react";

interface FormProps {
  setOpen: React.Dispatch<React.SetStateAction<any>>;
  email: string | null;
}

function Form({ setOpen, email }: FormProps) {
  //session

  //IMAGE RELATED BASE 64
  const [imageBase64, setImageBase64] = useState<string | null>("");
  const [currentImg, setImg] = useState<string>("");
  const [imgError, setImageError] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  //Form related states
  const [title, setTitle] = useState<String>("");
  const [content, setContent] = useState<String>("");
  const [postAs, setPostAs] = useState<Boolean>(false);
  const [concern, setConcern] = useState<String>("");

  //Form ref
  const formRef = useRef<HTMLFormElement>(null);

  //User Notification
  const [notif, setNotif] = useState<String>("");
  const [color, setColor] = useState<String>("");

  //image change handling
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
  // end of image related

  //Submit form
  const FormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await axios.post("/api/post/add", {
      email: email,
      title: title,
      content: content,
      isChecked: postAs,
      image: imageBase64,
      concern: concern,
    });

    const data = response.data;
    if (data.success) {
      setNotif(data.message);
      setColor("green");
    } else {
      setNotif(data.message);
      setColor("red");
    }

    setTimeout(() => {
      formRef.current?.reset();
      setColor("");
      setOpen(false);
    }, 1800);
  };

  return (
    <>
      <div className="fixed top-0 left-0 flex w-full h-screen bg-slate-400/50 z-50  justify-center items-center flex-col">
        <form
          className="w-3/5 bg-white h-1/2 p-8"
          onSubmit={FormSubmit}
          ref={formRef}
        >
          {notif && (
            <div className="text-white" style={{ backgroundColor: `${color}` }}>
              {notif}
            </div>
          )}
          {imgError && <p className="text-red-500">{imgError}</p>}
          <div className="flex items-center justify-between w-4/5 m-auto">
            <p>Add Feedback</p>
            <button type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
          <input
            type="text"
            className="border-2 border-solid border-black"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border-2 border-solid border-black resize-none w-full h-72"
            placeholder="Let your voice be heard."
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex items-center justify-center w-4/5 m-auto gap-6">
            <div className="flex items-center gap-2">
              <p>Post as Anonymous?</p>
              <input
                type="checkbox"
                onChange={(e) => setPostAs(e.target.checked)}
              />
            </div>

            <div className="flex items-center gap-2">
              <p>Concern:</p>
              <select
                className="border-2 border-solid border-black"
                onChange={(e) => setConcern(e.target.value)}
                required
              >
                <option value="">Please Select</option>
                <option value="facility">Facility</option>
                <option value="student">Student</option>
                <option value="etc">ETC</option>
              </select>
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputFileRef}
                className="hidden"
              />
              <button type="button" onClick={SelectImage}>
                Add Image
              </button>

              {currentImg && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={RemovePhoto}
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
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <button type="submit">ADD POST</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Form;
