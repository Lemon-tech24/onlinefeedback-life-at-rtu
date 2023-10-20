import axios from "axios";
import React, { useState, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { BsHeart, BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { DataForm, DisplayForm } from "../types";
import Form from "./Form";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";

function DisplayForms({ currentUserId, onCancel }: DisplayForm) {
  //open menu 3 dots
  const [openDots, setOpenDots] = useState<{ [postId: string]: boolean }>({});

  const toggleDotsMenu = (postId: string) => {
    setOpenDots({ ...openDots, [postId]: !openDots[postId] });
  };

  //what to see when delete
  const [overlayDelete, setOverlayDelete] = useState<boolean>(false);

  //edit
  const [edit, setEdit] = useState<{ [postId: string]: boolean }>({});

  //post to delete
  const [postToDelete, setPostToDelete] = useState<string>("");

  //open delete confirmation
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  //delete Ref
  const deleteRef = useRef<HTMLButtonElement | null>(null);

  //routing the page
  const router = useRouter();

  //delete notif
  const [deleteNotif, setDeleteNotif] = useState<string>("");

  //delete success indicator failed or success
  const [deleteFailed, setDeleteFailed] = useState<boolean>(false);

  const fetcher = (url: string) => axios.post(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR("/api/post/get/data", fetcher, {
    refreshInterval: 1100,
  });

  console.log(data);

  const DeletePost = async (postId: string) => {
    if (deleteRef.current) {
      deleteRef.current.disabled = true;
    }

    try {
      console.log("delete clicked ");
      const response = await axios.post("/api/post/delete", { postId: postId });
      const data = await response.data;

      if (data.success) {
        setDeleteNotif("Successfully Deleted");
        setDeleteFailed(false);
        setOverlayDelete(false);
      } else if (data.success === false) {
        setDeleteNotif("Failed To Delete");
        setDeleteFailed(true);
        setOverlayDelete(false);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteNotif("Error: Failed To Delete");
    }

    if (deleteRef.current) {
      deleteRef.current.disabled = false;
    }

    setTimeout(() => {
      setOpenDelete(false);
      setDeleteNotif("");
    }, 1000);
  };

  const capitalize = (text: string) => {
    return text.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );
  };

  console.log("delete this post", postToDelete);

  return (
    <div className="columns-4 gap-5 mb-4 mx-10 z-10">
      {deleteNotif && (
        <div
          className={
            "z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center"
          }
        >
          <div
            className={`${
              deleteFailed ? "bg-red-700" : "bg-green-700"
            } text-white`}
          >
            {deleteNotif}
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center gap-3">
          <div className="text-5xl text-blue-800 animate-spin">
            <VscLoading />
          </div>
          <div className="text-2xl ">Loading Data...</div>
        </div>
      ) : (
        data &&
        data.posts
          .slice(0)
          .reverse()
          .map((item: DataForm, key: string) => {
            return (
              <React.Fragment key={key}>
                <div
                  className={`mb-3 w-full h-full relative overflow-auto break-inside-avoid p-3 rounded-2xl bg-slate-400/80 shadow-sm hover:shadow-2xl hover:duration-500 cursor-pointer`}
                >
                  {/* when deleting show this */}
                  {overlayDelete && postToDelete === item.id ? (
                    <div className="absolute w-full h-full top-0 left-0 bg-slate-500/50 flex items-center justify-center">
                      <div className="text-7xl text-blue-800 animate-spin">
                        <VscLoading />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* Overlay of Delete */}
                  {openDelete && (
                    <div className="bg-slate-500/10 z-50 h-full w-full flex items-center justify-center fixed top-0 left-0 animate-fadeIn cursor-default overflow-hidden">
                      <div className="flex flex-col items-center bg-white p-4 rounded-xl gap-6">
                        <div className="text-xl font-bold flex w-full items-center justify-center">
                          Are you sure you want to delete the Post?
                        </div>

                        <div className="flex w-full items-center justify-center gap-5">
                          <button
                            onClick={() => DeletePost(postToDelete)}
                            className="bg-green-700 text-white p-1 rounded-lg text-lg w-20 hover:shadow-xl"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => {
                              setOpenDelete(false);
                              setOverlayDelete(false);
                            }}
                            className="bg-red-700 text-white p-1 rounded-lg text-lg w-20 hover:shadow-xl"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/*Display Contents*/}

                  <div
                    className="flex w-full items-center justify-end gap-1 duration-700"
                    onClick={() => toggleDotsMenu(item.id)}
                  >
                    {/* shows when clicked settings clicked */}
                    {openDots[item.id] && currentUserId === item.userId ? (
                      <div className="w-full flex right-0 items-center justify-end gap-1 animate-fadeIn">
                        <button
                          type="button"
                          onClick={() => setEdit({ ...edit, [item.id]: true })}
                        >
                          Edit this Post
                        </button>

                        <button
                          type="button"
                          ref={deleteRef}
                          onClick={() => {
                            setPostToDelete(item.id);
                            setOpenDelete(true);
                            setOverlayDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : openDots[item.id] && currentUserId !== item.userId ? (
                      <button>Report</button>
                    ) : (
                      ""
                    )}
                    {/* buttons 3dots*/}
                    <div className="flex items-center justify-center">
                      {openDots[item.id] ? (
                        <div className="text-2xl animate-fadeIn">
                          <AiOutlineCloseCircle />
                        </div>
                      ) : (
                        <div className="text-2xl animate-fadeIn">
                          <IoSettingsOutline />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Header */}
                  <div>
                    <p className="font-bold text-2xl break-words text-justify line-clamp-4 text-ellipsis w-full">
                      {item.title}
                    </p>
                    <p>Focus: {capitalize(item.concern)}</p>
                  </div>

                  {/* Content */}
                  <div className="bg-slate-100 rounded-xl p-5 flex items-center flex-col gap-5">
                    {/* Who Post it */}
                    <div className="flex items-center justify-start text-xl gap-1 w-full">
                      <div className="text-5xl">
                        <CgProfile />
                      </div>
                      {item.isChecked
                        ? `Anonymous ${
                            item.userId === currentUserId ? "(me)" : ""
                          }`
                        : item.user?.name
                        ? capitalize(atob(atob(item.user.name)))
                        : ""}
                    </div>

                    <div className="break-words text-justify line-clamp-4 text-ellipsis w-full">
                      {item.content}
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt="Image"
                        loading="lazy"
                        className="contain w-full rounded-2xl"
                      />
                    )}
                    <div className="w-full flex items-center justify-center gap-16">
                      <div className="text-2xl">
                        <BsHeartFill fill={"red"} />
                      </div>

                      <div className="text-3xl">
                        <HiOutlineChatBubbleOvalLeftEllipsis />
                      </div>

                      <div className="text-2xl">
                        <BsPeopleFill />
                      </div>
                    </div>
                  </div>

                  {/*Edit FOrm*/}
                  {edit[item.id] && (
                    <Form
                      mode={"edit"}
                      initialData={{
                        id: item.id,
                        title: item.title,
                        content: item.content,
                        isChecked: item.isChecked,
                        concern: item.concern,
                        image: item.image,
                        userId: currentUserId,
                      }}
                      onCancel={() => {
                        setEdit({ ...edit, [item.id]: false });
                        onCancel();
                      }}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })
      )}
    </div>
  );
}

export default DisplayForms;
