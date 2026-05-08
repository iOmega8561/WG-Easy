import { Dispatch, SetStateAction } from "react";
import Client from "./Client";

namespace Props {
    
  export interface Modal {
    dismissAction: () => void
  }

  export interface ClientRow {
    client: Client,
    setClients: Dispatch<SetStateAction<Client[]>>
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

  export interface NewClient extends Modal {
  }

  export interface Toggle {
    disabled?: boolean
    active: boolean
    onClick: () => void
  }

  export interface QRCode extends Modal {
    clientId: string
  }
}

export default Props;