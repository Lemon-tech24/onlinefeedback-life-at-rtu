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
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ViewPost from "./ViewPost";

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

  //delete notif
  const [deleteNotif, setDeleteNotif] = useState<string>("");

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

  const ReportChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const ReportPost = async (
    e: FormEvent<HTMLFormElement>,
    postId: string,
    userId: string,
    reason: string
  ) => {
    e.preventDefault();

    try {
      console.log("post id: ", postId);
      console.log("user id who report it: ", userId);
      console.log("Reason of report: ", reason);

      const response = await axios.post("/api/post/add/report", {
        postId: postId,
        userId: userId,
        reason: reason,
      });

      const data = response.data;

      if (data.success) {
        setReportNotif("Successfully Added");
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
        <div className="fixed top-14 2xl:top-0 left-28 w-full h-full flex items-center justify-start text-7xl font-semibold sm:text-6xl xs:text-3xl xs:left-24">
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
                  className={`mb-3 h-full relative overflow-auto break-inside-avoid p-3 rounded-2xl bg-slate-400/80 shadow-sm hover:shadow-2xl hover:duration-500 cursor-pointer lg:p-2 sm:w-full sm:m-auto sm:mb-4`}
                >
                  {openReport && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-500 animate-fadeIn">
                      <div className="flex flex-col w-5/12 bg-white rounded-2xl p-4">
                        {reportNotif ? (
                          <div className="absolute top-0 left-0 bg-slate-500/60 z-50 text-2xl w-full h-full flex items-center justify-center">
                            {reportNotif}
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="w-full flex items-center justify-end">
                          <button
                            className="rounded-xl text-white text-xl w-24 bg-red-600"
                            type="button"
                            onClick={() => setOpenReport(false)}
                          >
                            Close
                          </button>
                        </div>

                        <form
                          className="flex items-center justify-center gap-4"
                          ref={ReportRef}
                          onSubmit={(e) =>
                            ReportPost(e, postToReport, currentUserId, category)
                          }
                        >
                          <select
                            className="border-2 border-black border-solid rounded-lg p-1"
                            onChange={ReportChange}
                            required
                          >
                            <option value="">Please Select</option>
                            <option value="spam">Spam</option>
                            <option value="sexual">Sexual</option>
                            <option value="hate speech">Hate Speech</option>
                            <option value="profanity">Profanity</option>
                            <option value="harassment">Harassment</option>
                            <option value="violence">Violence</option>
                            <option value="others">Others</option>
                          </select>

                          <button type="submit">Report</button>
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
                        {deleteNotif && (
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-slate-500/40">
                            <div
                              className={`${
                                deleteFailed ? "bg-red-700" : "bg-green-700"
                              } text-white rounded-2xl text-2xl text-center`}
                            >
                              {deleteNotif}
                            </div>
                          </div>
                        )}
                        <div className="text-xl font-bold flex w-full items-center justify-center md:font-semibold md:text-lg">
                          Are you sure you want to delete the Post?
                        </div>

                        <div className="flex w-full items-center justify-center gap-5 md:gap-3">
                          <button
                            onClick={() => DeletePost(postToDelete)}
                            className="bg-green-700 text-white p-1 rounded-lg text-lg w-20 hover:shadow-xl md:text-base"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => {
                              setOpenDelete(false);
                              setOverlayDelete(false);
                            }}
                            className="bg-red-700 text-white p-1 rounded-lg text-lg w-20 hover:shadow-xl md:text-base"
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
                          className="bg-yellow-600 text-white rounded-xl px-2"
                        >
                          Edit this Post
                        </button>

                        <button
                          type="button"
                          ref={deleteRef}
                          className="bg-red-700 text-white rounded-xl px-2"
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
                      >
                        Report
                      </button>
                    ) : (
                      ""
                    )}
                    {/* buttons 3dots*/}
                    <div className="flex items-center justify-center bg-blue-600 rounded-full p-1">
                      {openDots[item.id] ? (
                        <div
                          className="text-2xl text-white animate-fadeIn"
                          onClick={() => toggleDotsMenu(item.id)}
                        >
                          <AiOutlineCloseCircle />
                        </div>
                      ) : (
                        <div
                          className="text-2xl text-white animate-fadeIn"
                          onClick={() => toggleDotsMenu(item.id)}
                        >
                          <IoSettingsOutline />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Header */}
                  <div>
                    <p className="font-bold text-2xl break-words text-justify line-clamp-2 text-ellipsis w-full 2xl:text-3xl xl:text-3xl">
                      {item.title}
                    </p>
                    <p>Focus: {capitalize(item.concern)}</p>
                  </div>

                  {/* Content */}
                  <div
                    className="bg-slate-100 rounded-tl-xl rounded-tr-xl p-5 flex items-center flex-col gap-5 sm:p-2 sm:w-full"
                    onClick={() => {
                      setOpenDetails(true);
                      setSelectedDetails(item.id);
                    }}
                  >
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

                    <div className="text-2xl">
                      <BsPeopleFill />
                    </div>

                    <div>Reports: {item.countreports}</div>
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
