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
    <div>
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
          className={`text-field w-auto px-2 py-1 ${textClass}`}
        />
      ) : (
        <div className={`
        ${textClass}
        group relative cursor-pointer
        flex items-center gap-2`}>
          {value}

          <div className="
          opacity-0 group-hover:opacity-100 
          transition-opacity">
            <Button
              variant="btn-sm"
              onClick={startEditing}
            >
              <Pencil size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editable;