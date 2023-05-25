import React, { useState, useEffect } from "react";
import ShareButton from "./ShareButton";

interface InputField {
  id: number;
  value: string;
}

const deserializeFields = (fieldsString: string) => {
  return fieldsString.split(",").map((value, id) => ({ id, value }));
};

const useUrlFields = (initialFields: InputField[]) => {
  const [fields, setFields] = useState<InputField[]>(initialFields);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFields = params.get("fields");
    if (urlFields) {
      setFields(deserializeFields(urlFields));
    }
  }, []);

  return [fields, setFields] as const;
};

const Roulette: React.FC = () => {
  const initialFields = [
    { id: 0, value: "" },
    { id: 1, value: "" },
    { id: 2, value: "" },
  ];
  const [fields, setFields] = useUrlFields(initialFields);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const newFields = fields.map((field) => {
      if (id === field.id) {
        return { id, value: e.target.value };
      }
      return field;
    });
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, { id: Date.now(), value: "" }]);
  };

  const handleDecide = () => {
    if (fields.length > 0) {
      let index = 0;
      const totalRunTime = 1500; // 1.5 seconds
      const totalFields = fields.length * 6; // Ensure running through fields more than once
      const timePerField = totalRunTime / totalFields;

      const intervalId = setInterval(() => {
        setSelectedField(fields[index % fields.length].id);
        index++;
      }, timePerField);

      setTimeout(() => {
        clearInterval(intervalId);
        const randomIndex = Math.floor(Math.random() * fields.length);
        setSelectedField(fields[randomIndex].id);
        setResult(fields[randomIndex].value);
      }, totalRunTime);
    }
  };

  const deleteField = (id: number) => () => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <div className="m-auto w-fit p-8">
      <div className="flex flex-col gap-2 mb-2">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-row gap-4">
            <input
              type="text"
              value={field.value}
              className={`rounded-md p-4 border-2 bg-white ${
                selectedField === field.id ? "border-blue-600" : "border-white"
              }`}
              onChange={(e) => handleChange(e, field.id)}
            />
            <button onClick={deleteField(field.id)}>🗑️</button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddField}
        className="mb-2 bg-white border-2 border-slate-200 hover:shadow-sm duration-200 w-full py-4 rounded-md"
      >
        ➕ Add Field
      </button>
      <button
        onClick={handleDecide}
        className="bg-blue-600 border-2 border-slate-200 text-white hover:shadow-sm duration-200 w-full py-4 rounded-md"
      >
        ✨ Decide
      </button>
      {result && (
        <div className="text-center font-bold py-4 text-xl">
          {result} is picked
        </div>
      )}
      <ShareButton fields={fields} setFields={setFields} />
    </div>
  );
};

export default Roulette;
