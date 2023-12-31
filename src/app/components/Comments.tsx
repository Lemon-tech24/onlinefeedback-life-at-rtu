import React, { useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { CommentData } from "../types";
import { CgProfile } from "react-icons/cg";

interface Data {
  postId: string;
  shortContent: boolean;
}
function Comments({ postId, shortContent }: Data) {
  const capitalize = (text: string) => {
    return text.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );
  };
  const fetcher = (url: string) =>
    axios.post(url, { postId: postId }).then((res) => res.data);
  const { data, error, isLoading, mutate } = useSWR(
    "/api/post/get/comments",
    fetcher,
    {
      refreshInterval: 100,
    }
  );

  useEffect(() => {
    const changesHappen = () => {
      mutate("/api/post/get/comments");
    };

    changesHappen();
  }, [postId]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  console.log("comments: ", data);
  if (!data || !data.comments || !Array.isArray(data.comments)) {
    return <div>Loading.</div>;
  }

  return (
    <>
      {data && data.comments.length > 0 ? (
        <div
          className={`w-full bg-slate-500/30 rounded-lg overflow-y-auto max-h-44 2xl:max-h-36 xl:max-h-32 xs:max-h-24 xs:mt-2 ${
            shortContent ? "sm:max-h-44" : ""
          } p-3 flex flex-col gap-4 2xl:gap-2 2xl:p-1`}
        >
          {data.comments
            .slice(0)
            .reverse()
            .map((item: CommentData, key: string) => {
              return (
                <div
                  className="bg-slate-200 p-2 w-full rounded-3xl 2xl:rounded-xl xl:p-1"
                  key={key}
                >
                  <div className="">
                    <div className="flex items-center justify-start gap-1">
                      <div className="text-3xl sm:text-base">
                        <CgProfile />
                      </div>
                      <div className="flex items-center sm:text-base xs:text-sm">
                        {capitalize(item.user?.name)}
                      </div>
                    </div>
                    <div className="break-words whitespace-break-spaces text-justify w-full px-2 sm:text-sm xs:text-xs">
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : null}
    </>
  );
}

export default Comments;
