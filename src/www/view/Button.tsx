import React from "react";
import Props from "../data/Props";

const Button: React.FC<Props.Button> = ({
  children,
  href,
  onClick
}) => {
  if (href) {
    return (
      <a href={href} className="
      flex items-center 
      gap-2 px-4 py-2 
      hover:bg-red-800 rounded
      hover:text-white
      border-2 border-gray-100 
      dark:border-neutral-600 hover:border-red-800
      transition">
        {children}
      </a>
    )
  }
  
  return (
    <button onClick={onClick} type="button" className="
    flex items-center 
    gap-2 px-4 py-2 
    hover:bg-red-800 rounded
    hover:text-white
    border-2 border-gray-100 
    dark:border-neutral-600 hover:border-red-800
    transition">
      {children}
    </button>
  )
}

export default Button;