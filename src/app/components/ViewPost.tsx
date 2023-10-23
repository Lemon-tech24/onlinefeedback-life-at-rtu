import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { ViewPost } from "../types";
import { CgProfile } from "react-icons/cg";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import Comments from "./Comments";

function ViewPost({
  formData,
  setOpenDetails,
  setCommentClicked,
  currentUserId,
  commentClicked,
}: ViewPost) {
  //check if its a short content to change font sizes
  const [shortContent, setShortContent] = useState<boolean>(false);

  //clickable image
  const [openImage, setOpenImage] = useState<boolean>(false);

  //comment text input
  const [comment, setComment] = useState<string>("");

  //commentlength
  const [commentlength, setCommentLength] = useState<number>(0);

  //error handling of add comment
  const [commentError, setCommentError] = useState<boolean | null>(null);

  //ref for input
  const commentRef = useRef<HTMLInputElement>(null);

  //ref for button
  const btnRef = useRef<HTMLButtonElement>(null);

  const capitalize = (text: string) => {
    return text.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );
  };
  useEffect(() => {
    const checkLength = async () => {
      try {
        if (formData && formData.content.length < 100) {
          setShortContent(true);
        } else {
          setShortContent(false);
        }

        if (commentClicked) {
          if (commentRef.current) {
            commentRef.current.focus();
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkLength();
  }, []);

  const handleChangeComment = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
    setCommentLength(comment.length);
  };

  const AddComment = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (commentRef.current) {
      commentRef.current.disabled = true;
    }
    if (btnRef.current) {
      btnRef.current.disabled = true;
    }
    try {
      if (comment) {
        const response = await axios.post("/api/post/add/comment", {
          content: comment,
          postId: formData.id,
          userId: currentUserId,
        });
        const data = response.data;

        if (data.success) {
          setCommentError(false);
          if (commentRef.current) {
            commentRef.current.disabled = false;
            commentRef.current.value = "";
          }

          if (btnRef.current) {
            btnRef.current.disabled = false;
          }
        } else {
          setCommentError(true);
          if (commentRef.current) {
            commentRef.current.disabled = true;
            commentRef.current.value = "";
          }

          if (btnRef.current) {
            btnRef.current.disabled = false;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-slate-500/80 z-50 animate-fadeIn overflow-hidden">
      <div
        className={`bg-white p-4 rounded-2xl ${
          shortContent ? "w-5/12" : "w-1/2"
        }`}
      >
        {/* Loading */}

        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={() => setOpenDetails(false)}
            className="text-xl text-white bg-red-600 px-2 rounded-2xl"
          >
            Close
          </button>
        </div>
        {/* Contents */}
        <div className="flex flex-col w-full items-center gap-1">
          <div className="text-2xl font-semibold break-words w-full text-justify">
            {formData.title}
          </div>
          <div className="flex items-center text-xl gap-2 w-full justify-start">
            Focus:
            <p className="font-semibold first-letter:uppercase">
              {formData.concern}
            </p>
          </div>

          {/* content */}
          <div
            className={`w-full bg-slate-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-evenly`}
          >
            {formData.image && (
              <div className="w-full flex items-center justify-center rounded-xl">
                <img
                  loading="lazy"
                  src={formData.image}
                  alt="image"
                  className="max-h-fit object-contain w-600 h-96 rounded-lg"
                  onClick={() => setOpenImage(true)}
                />
              </div>
            )}

            {/* Clickable image */}
            {openImage && formData.image && (
              <div className="fixed top-0 left-0 flex justify-center flex-col items-center w-full h-full bg-slate-500 z-50 animate-fadeIn">
                <div className="w-full h-full">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenImage(false);
                      setCommentClicked(false);
                    }}
                    className="bg-red-600 text-white rounded-2xl px-4 text-3xl fixed top-12 right-12"
                  >
                    Close
                  </button>
                  <img
                    src={formData.image}
                    alt="image"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}
            {/* ----------------------------------------------------- */}
            <div className="flex items-star flex-col w-full h-full">
              {formData.user && !formData.isChecked ? (
                <div
                  className={`flex items-center gap-1 w-full ${
                    shortContent ? "text-2xl" : "text-lg"
                  }`}
                >
                  <div className="text-4xl">
                    <CgProfile />
                  </div>
                  {capitalize(atob(atob(formData.user.name)))}
                </div>
              ) : (
                <div
                  className={`flex gap-1 items-center w-full ${
                    shortContent ? "text-2xl" : "text-lg"
                  }`}
                >
                  <div className="text-4xl">
                    <CgProfile />
                  </div>
                  Anonymous
                </div>
              )}

              <div
                className={`text-justify ${
                  shortContent ? "text-2xl" : "text-base"
                } break-words whitespace-break-spaces w-full`}
              >
                {formData.content}
              </div>
            </div>
          </div>
          {/* end of content */}

          {/* Ccomments */}
          <div className="w-full flex flex-col gap-2">
            {/* displaying */}

            <Comments postId={formData.id} />

            {/* Adding comment */}

            {commentError !== null && (
              <div>{commentError ? "Failed" : "Success"}</div>
            )}

            <form
              className="flex items-center w-full gap-4 justify-center"
              onSubmit={AddComment}
            >
              <input
                type="text"
                onChange={handleChangeComment}
                ref={commentRef}
                className="border-2 border-slate-600 border-solid rounded-2xl text-lg px-2 w-4/6"
                maxLength={100}
                required
              />
              <div>{commentlength}/100</div>
              <button
                type="submit"
                ref={btnRef}
                className=" text-green-700 text-3xl flex items-center"
              >
                <AiOutlineSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPost;
