import { Dispatch, SetStateAction } from "react";

namespace Props {
    
  export interface Clients {
    authenticated: boolean
  }

  export interface Login {
    setAuthenticated: Dispatch<SetStateAction<boolean | null>>
  }

  export interface Header {
    requiresPassword: boolean
    setAuthenticated: Dispatch<SetStateAction<boolean | null>>
  }

  export interface Interface {
    authenticated: boolean
  }

  export interface Button {
    children: React.ReactNode
    href?: string
    onClick?: () => void
  }
}

export default Props;