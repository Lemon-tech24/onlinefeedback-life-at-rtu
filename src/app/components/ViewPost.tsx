import React, { useEffect, useState } from "react";
import { DataForm, ViewPost } from "../types";
import axios from "axios";

function ViewPost({ postId, setOpenDetails }: ViewPost) {
  const [data, setData] = useState<DataForm | null>(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.post("/api/post/get/specific", {
          postId: postId,
        });

        const data = response.data;
        if (data.success) {
          setData(data.post);
        }
      } catch (err) {
        console.log(err);
      }
    };

    setTimeout(() => {
      getPost();
    }, 2000);
  }, []);

  console.log("details", data);
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-slate-500/20 z-50">
      <div className="bg-white p-4 rounded-2xl">
        {/* Loading */}

        <button type="button" onClick={() => setOpenDetails(false)}>
          Close
        </button>

        {data ? (
          <div className="">
            <div className="">{data.title}</div>
            <div>{data.concern}</div>
          </div>
        ) : (
          <div>Loading Details</div>
        )}
      </div>
    </div>
  );
}

export default ViewPost;
