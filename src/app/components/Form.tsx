import { FormProps, DataForm } from "@/app/types";
import axios from "axios";
import React, { ChangeEvent, useState, useRef } from "react";
import { BsIncognito } from "react-icons/bs";
import { BsPatchCheck } from "react-icons/bs";
import { BiImageAdd } from "react-icons/bi";
import { VscLoading } from "react-icons/vsc";

const Form: React.FC<FormProps> = ({ mode, initialData, onCancel }) => {
  //handle closing animation
  const [closeForm, setCloseForm] = useState<boolean>(false);

  //agreement for anonymous post
  const [openAgreement, setAgreement] = useState<boolean>(false);

  //form overlay
  const [overlay, setOverlay] = useState<boolean>(false);

  //submit button ref
  const btnRef = useRef<HTMLButtonElement>(null);

  //checkbox ref
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  //form data
  const [formData, setFormData] = useState<DataForm>(initialData);

  //const [currentImg, setImg] = useState<string | null>(formData.image ?? null); for displaying image

  //notif for image
  const [imgError, setImageError] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  //handle Changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckBox = () => {
    if (checkboxRef.current) {
      if (checkboxRef.current.checked === true) {
        setAgreement(false);
      } else {
        setAgreement(true);
      }
      checkboxRef.current.checked = !checkboxRef.current.checked;
      const checked = checkboxRef.current.checked;
      setFormData((prevData) => ({
        ...prevData,
        isChecked: checked,
      }));
    }
  };

  //Images related Here
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  //end of handle Changes

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    //

    //overlay of update
    setOverlay(true);

    //sliding animation
    setCloseForm(false);
    btnRef.current && (btnRef.current.textContent = "Please Wait");
    btnRef.current && btnRef.current.setAttribute("disabled", "true");

    if (mode === "add") {
      const response = await axios.post("/api/post/add", {
        formData: formData,
      });

      const data = response.data;

      if (data.success) {
        btnRef.current && btnRef.current.setAttribute("disabled", "false");
        setOverlay(false);

        setCloseForm(true);

        setTimeout(() => {
          onCancel();
        }, 600);
      } else {
        btnRef.current && btnRef.current.setAttribute("disabled", "false");
        setOverlay(false);

        setCloseForm(true);
      }
    }

    if (mode === "edit") {
      const response = await axios.post("/api/post/edit", {
        formData: formData,
      });
      const data = response.data;

      if (data.success) {
        btnRef.current && btnRef.current.setAttribute("disabled", "false");
        setOverlay(false);

        setCloseForm(true);

        setTimeout(() => {
          onCancel();
        }, 600);
      } else {
        btnRef.current && btnRef.current.setAttribute("disabled", "false");
        setOverlay(false);
        setCloseForm(true);
      }
    }

    setFormData(initialData);
    RemovePhoto();
  };

  return (
    <div
      className={`w-5/12 h-screen flex items-center justify-start flex-col fixed top-0 right-0 z-40 p-4 xl:p-4 lg:w-4/6 lg:p-4 md:w-4/6 sm:w-full ${
        closeForm
          ? "animate-sidebarReverse lg:animate-sidebarReverselg md:animate-sidebarReverselg sm:animate-sidebarReversefull"
          : "animate-sidebar lg:animate-sidebarlg md:animate-sidebarlg sm:animate-sidebarfull"
      }
      `}
      style={{ backgroundColor: "#DBD9D9" }}
    >
      {/* NOTIFICATION  */}

      {/* LOADING OVERLAY */}
      {overlay && (
        <div className="absolute top-0 right-0 z-50 bg-slate-300/90 h-full w-full flex items-center justify-center">
          <div className="text-7xl text-blue-700 animate-spin">
            <VscLoading />
          </div>
        </div>
      )}

      {/* ANONYMOUS AGREEMENT */}
      {openAgreement && (
        <div
          className={`absolute top-0 left-0 w-full h-full z-50 bg-slate-500/80 flex items-center justify-center ${
            openAgreement ? "animate-fadeIn" : "animate-fadeOut"
          }`}
        >
          <div className="flex flex-col items-center gap-5 bg-white w-10/12 rounded-xl p-4 md:p-2 sm:w-11/12">
            <p className="text-xl font-bold">Anonymous Post</p>
            <p className="text-lg md:text-base text-center sm:text-sm">
              Anonymous posts published in the website do not include your name
            </p>
            <div className="flex items-center gap-4 flex-col">
              {/* First paragraph */}
              <div className="flex items-center justify-start gap-5 w-10/12 full m-auto md:w-full md:gap-3">
                <div className="text-3xl sm:text-2xl">
                  <BsIncognito />
                </div>
                <p className="text-justify sm:text-sm">
                  Admins of the Life@RTU can see your name for satefy purposes.
                </p>
              </div>

              {/* SEcond paragraph */}
              <div className="flex items-center justify-start gap-5 w-10/12 m-auto md:w-full md:gap-3">
                <div className="text-3xl sm:text-2xl">
                  <BsPatchCheck />
                </div>
                <p className="text-justify sm:text-sm">
                  Admins and moderators may reach out to you personally once
                  your feedback is highly alarming of someone's privacy or
                  safety.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl p-1 text-lg text-black"
              style={{ backgroundColor: "#3085C3" }}
              onClick={() => setAgreement(false)}
            >
              Agree
            </button>
          </div>
        </div>
      )}

      <div className="w-full">
        {imgError && (
          <p className="text-white bg-red-600 px-2 rounded-2xl w-1/2 text-center">
            {imgError}
          </p>
        )}

        {/*------------------------------------------------------*/}

        {!closeForm && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full items-center justify-center gap-2 animate-fadeIn h-80"
          >
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setCloseForm(true);
                  setTimeout(() => {
                    onCancel();
                  }, 400);
                }}
                className="text-2xl text-black font-semibold rounded-2xl px-6 lg:text-xl md:text-lg"
                style={{ backgroundColor: "#FFB000" }}
              >
                Cancel
              </button>
            </div>

            {/*TITLE */}
            <input
              type="text"
              name="title"
              className="outline-none text-5xl w-full bg-transparent font-bold placeholder-black lg:text-4xl md:text-3xl"
              value={formData.title}
              placeholder="Untitled"
              onChange={handleChange}
              maxLength={100}
              required
            />

            {/*CONCERN*/}
            <div className="w-full flex items-center justify-start gap-5">
              <p className="text-4xl lg:text-3xl md:text-2xl">FOCUS:</p>
              <select
                onChange={handleChange}
                value={formData.concern}
                className="w-full pr-4 text-2xl outline-none rounded-xl p-2 bg-transparent text-left md:text-xl"
                name="concern"
                required
              >
                <option value=""></option>
                <option value="facility">Facility</option>
                <option value="professor">Professor</option>
                <option value="experience">Experience</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/*CONTENT*/}
            <div className="w-full flex items-center justify-center flex-col">
              <textarea
                placeholder="What's Happening now?"
                name="content"
                className="resize-none w-full h-96 outline-none rounded-t-xl text-xl text-justify p-4"
                value={formData.content}
                onChange={handleChange}
                maxLength={500}
                required
              />
              <div className="bg-white rounded-b-xl w-full flex items-center justify-between pb-2 px-3">
                <div
                  className={`w-1/3 ${
                    formData.image ? "animate-fadeIn" : "animate-fadeOut"
                  }`}
                >
                  {formData.image && "with Photo"}
                </div>
                <div className="w-1/3 flex justify-center">
                  {formData.content.length} / 500
                </div>
                <div className="w-1/3"></div>
              </div>
            </div>

            {/* MAIN PARENT */}
            <div className="flex items-center justify-end w-full gap-6">
              {/* POST AS ANONYMOUS */}
              <input
                type="checkbox"
                name="isChecked"
                ref={checkboxRef}
                className="hidden"
                defaultChecked={formData.isChecked}
              />

              {/*IMAGE */}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputFileRef}
                className="hidden"
              />

              {!formData.image && (
                <button
                  type="button"
                  onClick={() => {
                    inputFileRef.current?.click();
                  }}
                  className="text-4xl flex items-center justify-center"
                >
                  <BiImageAdd />
                </button>
              )}

              {formData.image && (
                <button
                  type="button"
                  className={`bg-red-600 rounded-xl p-1 text-white text-lg ${
                    formData.image ? "animate-fadeIn" : "animate-fadeOut"
                  }`}
                  onClick={RemovePhoto}
                >
                  Remove Photo
                </button>
              )}

              <button
                type="button"
                onClick={handleCheckBox}
                style={{
                  color: checkboxRef.current?.checked ? "black" : "white",
                }}
                className="text-3xl flex items-center justify-center"
              >
                {/* White means yes anonymous, Blacks means no anonymous */}
                <BsIncognito />
              </button>

              {/* button */}
              <button
                type="submit"
                ref={btnRef}
                className="text-lg p-2 text-black rounded-xl font-semibold"
                style={{ backgroundColor: "#3085C3" }}
              >
                Submit
              </button>
            </div>
            {/* end */}
          </form>
        )}
      </div>
    </div>
  );
};

export default Form;
