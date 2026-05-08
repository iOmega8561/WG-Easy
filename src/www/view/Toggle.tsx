import React from "react";
import Props from "../data/Props";

const Toggle: React.FC<Props.Toggle> = ({
  disabled = false,
  active,
  onClick
}) => {

  return (
    <div className="
    flex 
    gap-2">
      <div onClick={onClick} className={`
      w-10 h-6 px-1 
      rounded-full 
      cursor-pointer 
      flex items-center justify-start
      transition
      ${active ? 'bg-red-800' : 'bg-gray-300 dark:bg-neutral-500 '}`}>
        <div className={`
        w-4 h-4 
        transition-transform duration-300
        bg-white rounded-full shadow-sm
        ${active ? 'translate-x-4' : 'translate-x-0'}`}/>
      </div>
    </div>
  )
}

export default Toggle;