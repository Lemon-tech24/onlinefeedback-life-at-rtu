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

function DisplayForms({ currentUserId, onCancel }: DisplayForm) {
  const [edit, setEdit] = useState<{ [postId: string]: boolean }>({});
  //post to delete
  const [postToDelete, setPostToDelete] = useState<string>("");

  //open delete confirmation
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  //open details btn
  const [details, setDetails] = useState<{ [postId: string]: boolean }>({});

  //delete Ref
  const deleteRef = useRef<HTMLButtonElement | null>(null);

  //deleteLoad
  const [deleteLoad, setDeleteLoad] = useState<boolean>(false);

  //routing the page
  const router = useRouter();

  //delete notif
  const [deleteNotif, setDeleteNotif] = useState<string>("");

  const fetcher = (url: string) => axios.post(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR("/api/post/get/data", fetcher, {
    refreshInterval: 1100,
  });

  console.log(data);

  const DeletePost = async (postId: string) => {
    setDeleteLoad(true);
    if (deleteRef.current) {
      deleteRef.current.disabled = true;
    }

    try {
      console.log("delete clicked ");
      const response = await axios.post("/api/post/delete", { postId: postId });
      const data = response.data;

      if (data.success) {
        setDeleteNotif("Successfully Deleted");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteNotif("Error: Failed To Delete");
    }

    if (deleteRef.current) {
      deleteRef.current.disabled = false;
      setDeleteLoad(false);
    }

    setTimeout(() => {
      setOpenDelete(false);
      setDeleteNotif("");
    }, 1000);
  };

  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  console.log("delete this post", postToDelete);
  return (
    <div className="columns-4 gap-5 mb-4 mx-10">
      {deleteNotif && (
        <div className="z-50 fixed top-0 left-0 w-full flex items-center justify-center">
          {deleteNotif}
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
                  className={`mb-3 z-20 w-full overflow-auto break-inside-avoid p-3 rounded-2xl bg-slate-400/80 shadow-sm hover:shadow-2xl hover:duration-500 cursor-pointer`}
                >
                  {openDelete && (
                    <div className="bg-slate-500/10 h-full w-full flex items-center justify-center fixed top-0 left-0 animate-fadeIn">
                      <div className="flex flex-col items-center bg-white p-4 rounded-xl gap-6">
                        <div className="text-xl font-bold flex w-full items-center justify-center">
                          Are you sure you want to delete the Post?
                        </div>

                        <div className="flex w-full items-center justify-center gap-5">
                          <button
                            onClick={() => DeletePost(postToDelete)}
                            className="bg-green-700 text-white p-1 rounded-lg text-lg w-20"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setOpenDelete(false)}
                            className="bg-red-700 text-white p-1 rounded-lg text-lg w-20"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/*Display Contents*/}
                  {currentUserId === item.userId && (
                    <div className="w-full flex items-center justify-end gap-1">
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
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Header */}
                  <div>
                    <p className="font-bold text-2xl break-words text-justify line-clamp-4 text-ellipsis w-full">
                      {item.title}
                    </p>
                    <p>Focus: {item.concern}</p>
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
