import React from "react";
import Props from "../../data/Props";

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
        className={`${variant} ${disabled ? 'btn-disabled' : ''}`}
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
        className={`${variant} ${disabled ? 'btn-disabled' : ''}`}
      >
        {children}
      </button>
    )
  }

  return (
    <button 
      disabled={disabled} 
      type="submit" 
      className={`${variant} ${disabled ? 'btn-disabled' : ''}`}
    >
      {children}
    </button>
  )
}

export default Button;