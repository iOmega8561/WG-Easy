import { useRef, useState } from "react";
import { Pencil } from "lucide-react";

import Props from "../data/Props";
import Button from "./Button";

const Editable: React.FC<Props.Editable> = ({
  onConfirm,
  textClass,
  value
}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  const startEditing = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const save = () => {
    if (isEditing) {
      setIsEditing(false);
      if (editValue != value) onConfirm(editValue);
      setEditValue('');
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue('');
  };

  return (
    <div className="max-sm:w-32">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancelEditing();
          }}
          className={`text-field my-2 px-2 py-1 ${textClass}`}
        />
      ) : (
        <div className="
        group relative cursor-pointer
        flex items-center gap-2">
          <span className={textClass}>
            {value}
          </span>

          <div className="
          opacity-0 group-hover:opacity-100 
          transition-opacity">
            <Button
              variant="btn-sm"
              onClick={startEditing}
            >
              <Pencil size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editable;