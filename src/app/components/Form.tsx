"use client";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";

function Form({ isOpen, setOpen }: any) {
  const [imageBase64, setImageBase64] = useState<string | null>(String);
  const [currentImg, setImg] = useState(String);

  const [title, setTitle] = useState(String);
  //to be filled because EdenAI has fees const [TitleAnalyzed, setNewTitle] = useState(String);

  const [textarea, setTextArea] = useState(String);
  const [isChecked, setChecked] = useState(false);

  const [btnDisabled, setBtnDisabled] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const [notif, setNotif] = useState(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImg(URL.createObjectURL(file));
        const base64String = await convertToBase64(file);
        setImageBase64((prevImage) => base64String as string | null);
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
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

  const ChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const ChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea(e.target.value);
  };

  const ChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const AddPost = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setBtnDisabled(true);
      console.log("title:", title);
      console.log("textarea: ", textarea);
      console.log("base64:", imageBase64);
      console.log("checkbox: ", isChecked);

      const response = await axios.post("api/post/add");

      const data = await response.data;

      if (data.success) {
        setBtnDisabled(false);
        setImageBase64(null);
        setImg("");
        formRef.current?.reset();
      } else {
        setBtnDisabled(false);
      }

      setNotif(data.message);

      setTimeout(() => {
        setNotif(null);
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-slate-500 opacity-80 animate-fadeAway`}
    >
      {notif && <div>{notif}</div>}
      <form
        className="flex items-center justify-center flex-col bg-white w-1/2 px-2 py-10 gap-2 rounded-2xl"
        method="POST"
        ref={formRef}
        onSubmit={AddPost}
      >
        <div className="flex w-4/5 py-4 items-center justify-between">
          <p className="font-bold text-2xl">What&apos;s Happening?</p>
          <button
            className="bg-red-700 rounded-2xl p-1 px-4 text-white"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>

        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={ChangeTitle}
          className="rounded-lg w-4/5 border-solid border-2 border-black p-1 text-2xl"
          required
        />

        <textarea
          placeholder="What's on your mind?"
          className="w-4/5 border-solid border-2 border-black rounded-lg text-lg p-1 resize-none h-96"
          onChange={ChangeTextArea}
          maxLength={600}
          required
        />

        <button type="button" className="cursor-pointer" onClick={SelectImage}>
          Select Image
        </button>
        <input
          type="file"
          id="imgfile"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={inputFileRef}
        />

        <div className="flex items-center gap-1">
          <p>Post As Anonymous?</p>
          <input type="checkbox" onChange={ChangeCheckbox} />
        </div>

        <button type="submit" disabled={btnDisabled ? true : false}>
          {btnDisabled ? "Adding..." : "Add Feedback"}
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
      </form>
    </div>
  );
}

export default Form;
