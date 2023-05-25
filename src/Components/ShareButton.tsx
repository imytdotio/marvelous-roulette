import React, { useState } from "react";

interface InputField {
  id: number;
  value: string;
}

interface ShareButtonProps {
  fields: InputField[];
  setFields: (fields: InputField[]) => void;
}

const serializeFields = (fields: InputField[]) => {
  return fields.map((field) => field.value).join(",");
};

interface Message {
  type: "success" | "error";
  message: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ fields, setFields }) => {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("fields", serializeFields(fields));
    const newUrl =
      window.location.origin +
      window.location.pathname +
      "?" +
      params.toString();
    window.history.pushState({}, "", newUrl);
    setFields(fields);

    // Copy to clipboard
    navigator.clipboard
      .writeText(newUrl)
      .then(() => {
        setMessage({ type: "success", message: "Copied to clipboard!" });
      })
      .catch((err) => {
        setMessage({
          type: "error",
          message: "Copied to clipboard!" + err.message,
        });
      });
  };

  const [message, setMessage] = useState<Message | null>(null);

  return (
    <>
      <button
        onClick={handleShare}
        className="bg-white border-2 border-slate-200 hover:shadow-sm duration-200 w-full py-4 rounded-md"
      >
        Share Roulette
      </button>
      <p
        className={`text-center ${
          message?.type == "success" ? "text-green-600" : "text-red-600"
        }`}
      >
        {message && message.message}
      </p>
    </>
  );
};

export default ShareButton;
