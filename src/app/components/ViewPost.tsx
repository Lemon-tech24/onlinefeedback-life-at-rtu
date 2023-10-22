import React, { useEffect, useState } from "react";
import { DataForm, ViewPost } from "../types";
import axios from "axios";

function ViewPost({ formData, setOpenDetails }: ViewPost) {
  const capitalize = (text: string) => {
    return text.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );
  };
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-slate-500/80 z-50 animate-fadeIn">
      <div className="bg-white p-4 rounded-2xl">
        {/* Loading */}

        <button type="button" onClick={() => setOpenDetails(false)}>
          Close
        </button>

        <div>
          <div>{formData.id}</div>
          <div>{formData.title}</div>
          {formData.user && !formData.isChecked ? (
            <div>{capitalize(atob(atob(formData.user.name)))}</div>
          ) : (
            <div>Anonymous</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewPost;
