import React from "react";

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
        console.log("URL copied to clipboard");
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  };

  return (
    <button
      onClick={handleShare}
      className="mb-2 bg-white border-2 border-slate-200 hover:shadow-sm duration-200 w-full py-4 rounded-md"
    >
      Share Roulette
    </button>
  );
};

export default ShareButton;
