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
    variant?: 'btn-lg' | 'btn-md' | 'btn-sm'
    href?: string
    disabled?: boolean
    onClick?: () => void
  }

  export interface NewClient {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
  }

  export interface Toggle {
    disabled?: boolean
    active: boolean
    onClick: () => void
  }
}

export default Props;