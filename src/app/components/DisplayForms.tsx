import axios from "axios";
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { CgProfile } from "react-icons/cg";
import { BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { DataForm, DisplayForm } from "../types";
import Form from "./Form";
import useSWR from "swr";
import { VscLoading } from "react-icons/vsc";
import { CgClose } from "react-icons/cg";
import { LuSettings2 } from "react-icons/lu";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ViewPost from "./ViewPost";
import moment from "moment";

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

  //delete success indicator failed or success
  const [deleteFailed, setDeleteFailed] = useState<boolean>(false);

  //when comment clicked auto focus
  const [Clicked, setClicked] = useState<boolean>(false);

  //fetcher for the post data
  const fetcher = (url: string) => axios.post(url).then((res) => res.data);

  const { data, error, isLoading, mutate } = useSWR(
    "/api/post/get/data",
    fetcher,
    {
      refreshInterval: 600,
    }
  );

  //open post see whole post/comments etc.
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [selectedDetails, setSelectedDetails] = useState<string>("");

  //overlay of report
  const [openReport, setOpenReport] = useState<boolean>(false);
  //set post to report
  const [postToReport, setpostToReport] = useState<string>("");

  //report category
  const [category, setCategory] = useState<string>("");

  //form report
  const ReportRef = useRef<HTMLFormElement>(null);

  //report notif
  const [reportNotif, setReportNotif] = useState<string>("");

  //delete loading
  const [loadDelete, setLoadDelete] = useState<boolean>(false);

  const DeletePost = async (postId: string) => {
    if (deleteRef.current) {
      deleteRef.current.disabled = true;
    }
    setLoadDelete(true);
    try {
      console.log("delete clicked ");
      const response = await axios.post("/api/post/delete", { postId: postId });
      const data = await response.data;

      if (data.success) {
        setDeleteFailed(false);
        setOverlayDelete(false);
        setLoadDelete(false);
      } else if (data.success === false) {
        setDeleteFailed(true);
        setOverlayDelete(false);
        setLoadDelete(false);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }

    if (deleteRef.current) {
      deleteRef.current.disabled = false;
    }

    setTimeout(() => {
      setOpenDelete(false);
    }, 1200);
  };

  const Reaction = async (postId: string) => {
    console.log("To React : ", postId);
    try {
      const response = await axios.post("/api/post/add/react", {
        postId: postId,
        userId: currentUserId,
      });

      const data = response.data;
    } catch (err) {
      console.error(err);
    }
  };
  const capitalize = (text: string) => {
    return text.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );
  };

  const ReportPost = async (
    e: FormEvent<HTMLFormElement>,
    postId: string,
    userId: string,
    reason: string
  ) => {
    e.preventDefault();

    try {
      if (!reason) {
        alert("Category Required to report");
      }
      const response = await axios.post("/api/post/add/report", {
        postId: postId,
        userId: userId,
        reason: reason,
      });

      const data = response.data;

      if (data.success) {
        setReportNotif("Successfully Reported");
      } else {
        setReportNotif(data.message);
      }

      setTimeout(() => {
        setReportNotif("");
        setOpenReport(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };
  console.log("To be display", data);

  const handleSeen = async (postId: string, userId: string) => {
    try {
      const response = await axios.post("/api/post/add/seen", {
        postId: postId,
        userId: userId,
      });

      const data = response.data;

      if (data.success) {
        console.log("seen added");
      } else {
        console.log("seen not added");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="columns-4 gap-5 mb-4 mx-10 2xl:columns-3 xl:columns-3 lg:columns-3 lg:gap-3 lg:mb-2 lg:mx-5 md:columns-2 md:mx-3 md:mb-2 md:gap-3 sm:columns-1 sm:mb-4">
      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center gap-3">
          <div className="text-5xl text-blue-800 animate-spin">
            <VscLoading />
          </div>
          <div className="text-2xl ">Loading Data...</div>
        </div>
      ) : data.posts.length === 0 ? (
        <div className="fixed top-14 2xl:top-0 left-32 w-full h-full flex items-center justify-start text-7xl font-semibold sm:text-6xl xs:text-3xl xs:left-24">
          We Care <br />
          about what <br />
          you think.
        </div>
      ) : (
        data &&
        data.posts &&
        data.posts
          .slice(0)
          .reverse()
          .map((item: DataForm, key: string) => {
            return (
              <React.Fragment key={key}>
                <div
                  className={`mb-3 h-full relative overflow-auto break-inside-avoid p-2 rounded-2xl bg-slate-400/80 shadow-sm hover:shadow-2xl hover:duration-500 cursor-pointer lg:p-2 sm:w-full sm:m-auto sm:mb-4`}
                >
                  {openReport && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-500/70 animate-fadeIn z-50">
                      <div className="flex flex-col w-5/12 xl:w-7/12 md:w-9/12 xs:w-11/12 bg-white rounded-2xl p-4">
                        {reportNotif ? (
                          <div className="absolute top-0 left-0 bg-slate-500/60 z-50 text-2xl w-full h-full flex items-center justify-center">
                            {reportNotif}
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="w-full flex items-center justify-end">
                          <button
                            className=" text-black text-xl xs:text-base"
                            type="button"
                            onClick={() => {
                              setOpenReport(false);
                              setCategory("");
                            }}
                          >
                            <CgClose />
                          </button>
                        </div>

                        <form
                          className="w-full flex flex-col items-start justify-center gap-4"
                          ref={ReportRef}
                          onSubmit={(e) =>
                            ReportPost(e, postToReport, currentUserId, category)
                          }
                        >
                          <div className="flex flex-col w-full">
                            <div className="w-full flex items-center justify-center text-2xl">
                              Report
                            </div>
                            <p className="text-xl">Please Select a problem</p>
                            <p className="text-sm break-words whitespace-normal xs:text-xs">
                              if someone is in immediate danger, get help before
                              reporting to admins. Don't Wait.
                            </p>
                            <div className="flex flex-col items-start justify-center xs:text-sm">
                              <button
                                type="button"
                                onClick={() => setCategory("hate speech")}
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "hate speech"
                                    ? "bg-gray-300"
                                    : ""
                                }`}
                              >
                                Hate Speech
                              </button>

                              <button
                                type="button"
                                onClick={() => setCategory("spam")}
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "spam" ? "bg-gray-300" : ""
                                }`}
                              >
                                Spam
                              </button>
                              <button
                                type="button"
                                onClick={() => setCategory("false information")}
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "false information"
                                    ? "bg-gray-300"
                                    : ""
                                }`}
                              >
                                False Information
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCategory("suicidal or selfinjury")
                                }
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "suicidal or selfinjury"
                                    ? "bg-gray-300"
                                    : ""
                                }`}
                              >
                                Suicidal or Self-injury
                              </button>
                              <button
                                type="button"
                                onClick={() => setCategory("harassment")}
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "harassment" ? "bg-gray-300" : ""
                                }`}
                              >
                                Harrassment
                              </button>
                              <button
                                type="button"
                                onClick={() => setCategory("violence")}
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "violence" ? "bg-gray-300" : ""
                                }`}
                              >
                                Violence
                              </button>
                              <button
                                type="button"
                                onClick={() => setCategory("nudity")}
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "nudity" ? "bg-gray-300" : ""
                                }`}
                              >
                                Nudity
                              </button>
                              <button
                                type="button"
                                onClick={() => setCategory("something else")}
                                className={`font-semibold p-1 rounded-xl w-5/12 text-left ${
                                  category === "something else"
                                    ? "bg-gray-300"
                                    : ""
                                }`}
                              >
                                Something else
                              </button>
                            </div>
                          </div>

                          <div className="w-full flex items-center justify-center">
                            <button
                              type="submit"
                              className="text-black font-bold p-1 rounded-xl uppercase"
                              style={{ backgroundColor: "#3085C3" }}
                            >
                              Report
                            </button>
                          </div>

                          <p className="w-full text-center text-xs break-words whitespace-normal">
                            Our admins & moderators will investigate this
                            feedback, Thank you.
                          </p>
                        </form>
                      </div>
                    </div>
                  )}
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
                      <div className="flex flex-col items-center bg-white p-4 rounded-xl gap-6 md:p-2 md:gap-3">
                        {loadDelete && (
                          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-400/70 text-blue-800">
                            <div className="text-7xl animate-spin">
                              <VscLoading />
                            </div>
                          </div>
                        )}
                        <div className="text-xl font-bold flex w-full items-center justify-center md:font-semibold md:text-lg">
                          Are you sure you want to delete the post?
                        </div>

                        <div className="flex w-full items-center justify-center gap-5 md:gap-3">
                          <button
                            onClick={() => {
                              DeletePost(postToDelete);
                              setLoadDelete(true);
                            }}
                            className="text-black p-1 font-semibold rounded-lg text-lg w-20 hover:shadow-xl md:text-base"
                            style={{ backgroundColor: "#D9D9D9" }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => {
                              setOpenDelete(false);
                              setOverlayDelete(false);
                              setLoadDelete(false);
                            }}
                            className="bg-red-700 font-semibold text-white p-1 rounded-lg text-lg w-20 hover:shadow-xl md:text-base"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/*Display Contents*/}

                  <div className="flex w-full items-center justify-end gap-1 duration-700">
                    {/* shows when clicked settings clicked */}
                    {openDots[item.id] && currentUserId === item.userId ? (
                      <div className="w-full flex right-0 items-center justify-end gap-1 animate-fadeIn">
                        <button
                          type="button"
                          onClick={() => setEdit({ ...edit, [item.id]: true })}
                          className="text-black rounded-lg px-2"
                          style={{ backgroundColor: "#D9D9D9" }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          ref={deleteRef}
                          className="bg-red-700 text-white rounded-lg px-2"
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
                      <button
                        type="button"
                        onClick={() => {
                          setOpenReport(true);
                          setpostToReport(item.id);
                        }}
                        className="text-black px-1 rounded-lg animate-fadeIn"
                        style={{ backgroundColor: "#D9D9D9" }}
                      >
                        Report
                      </button>
                    ) : (
                      ""
                    )}
                    {/* buttons 3dots*/}
                    <div className="flex items-center justify-center rounded-full p-1">
                      {openDots[item.id] ? (
                        <div
                          className="text-2xl text-black animate-fadeIn"
                          onClick={() => toggleDotsMenu(item.id)}
                        >
                          <AiOutlineCloseCircle />
                        </div>
                      ) : (
                        <div
                          className="text-2xl text-black animate-fadeIn"
                          onClick={() => toggleDotsMenu(item.id)}
                        >
                          <LuSettings2 />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Header */}
                  <div className="px-2 pb-1">
                    <p className="font-bold text-2xl break-words text-justify line-clamp-2 text-ellipsis w-full 2xl:text-3xl xl:text-3xl">
                      {item.title}
                    </p>
                    <div className="flex gap-1">
                      Focus:
                      <p className="uppercase font-semibold">
                        {capitalize(item.concern)}
                      </p>
                    </div>
                    <p className="text-xs">
                      {moment(item.createdAt).format("lll")}
                    </p>
                  </div>

                  {/* Content */}
                  <div
                    className="bg-slate-100 rounded-tl-xl rounded-tr-xl p-5 flex items-center flex-col gap-5 sm:p-2 sm:w-full"
                    onClick={() => {
                      setOpenDetails(true);
                      handleSeen(item.id, currentUserId);
                      setSelectedDetails(item.id);
                    }}
                  >
                    {/* Who Post it */}
                    <div className="flex items-center justify-start text-xl gap-1 w-full font-semibold">
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

                    <div className="break-words text-justify line-clamp-4 text-ellipsis w-full 2xl:text-xl xl:text-xl">
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
                  </div>
                  <div className="w-full flex items-center justify-center gap-16 py-2 bg-slate-100 rounded-bl-xl rounded-br-xl">
                    <div
                      className="text-2xl flex items-center gap-1"
                      onClick={() => Reaction(item.id)}
                    >
                      <BsHeartFill
                        fill={
                          item.likes &&
                          item.likes.some(
                            (like: any) =>
                              like.postId === item.id &&
                              like.userId === currentUserId
                          )
                            ? "red"
                            : "black"
                        }
                      />
                      <p className="text-base flex items-center">
                        {item.countlikes}
                      </p>
                    </div>

                    <div
                      className="text-3xl flex items-center"
                      onClick={() => {
                        setClicked(true);
                        setOpenDetails(true);
                        setSelectedDetails(item.id);
                      }}
                    >
                      <HiOutlineChatBubbleOvalLeftEllipsis />
                      <p className="text-base">
                        {item.comments && item.comments >= 1000
                          ? (item.comments / 1000).toFixed(1) + "k"
                          : item.comments}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="text-2xl">
                        <BsPeopleFill />
                      </div>
                      <p>
                        {item.countseens && item.countseens >= 1000
                          ? (item.countseens / 1000).toFixed(1) + "k"
                          : item.countseens}
                      </p>
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
                {/* open  post */}
                {openDetails && selectedDetails === item.id && (
                  <ViewPost
                    formData={{
                      id: item.id,
                      title: item.title,
                      userId: item.user?.id ?? "",
                      content: item.content,
                      isChecked: item.isChecked,
                      concern: item.concern,
                      image: item.image,
                      user: {
                        id: item.user?.id ?? "",
                        name: item.user?.name ?? "",
                      },
                      createdAt: item.createdAt,
                    }}
                    commentClicked={Clicked}
                    currentUserId={currentUserId}
                    setCommentClicked={setClicked}
                    setOpenDetails={setOpenDetails}
                  />
                )}
              </React.Fragment>
            );
          })
      )}
    </div>
  );
}

export default DisplayForms;
