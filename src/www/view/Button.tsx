import React from "react";
import Props from "../data/Props";

const Button: React.FC<Props.Button> = ({
  children,
  variant = "btn-md",
  href,
  onClick
}) => {

  if (href) {
    return (
      <a href={href} className={variant}>
        {children}
      </a>
    )
  }
  
  if (onClick) {
    return (
      <button onClick={onClick} type="button" className={variant}>
        {children}
      </button>
    )
  }

  return (
    <button type="submit" className={variant}>
      {children}
    </button>
  )
}

export default Button;