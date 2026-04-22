import React from "react";
import Props from "../data/Props";

const Button: React.FC<Props.Button> = ({
  children,
  variant = "btn-md",
  href,
  disabled = false,
  onClick
}) => {

  if (href) {
    return (
      <a 
        href={href} 
        className={variant}
      >
        {children}
      </a>
    )
  }
  
  if (onClick) {
    return (
      <button 
        disabled={disabled} 
        onClick={onClick} 
        type="button" 
        className={variant}
      >
        {children}
      </button>
    )
  }

  return (
    <button 
      disabled={disabled} 
      type="submit" 
      className={variant}
    >
      {children}
    </button>
  )
}

export default Button;