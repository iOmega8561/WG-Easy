import { Dispatch, SetStateAction } from "react";
import Client from "./Client";
import ClientStats from "./ClientStats";

namespace Props {
  export interface Button {
    children: React.ReactNode
    variant?: 'btn-lg' | 'btn-md' | 'btn-sm'
    href?: string
    disabled?: boolean
    onClick?: () => void
  }

  export interface ClientRow {
    client: Client,
    stats?: ClientStats | undefined,
    onUpdate: () => void
  }

  export interface Dialog extends Modal {
    onConfirm: () => void
  }

  export interface Editable {
    value: string,
    textClass: string,
    onConfirm: (newValue: string) => void
  }

  export interface Header {
    requiresPassword: boolean
    setAuthenticated: Dispatch<SetStateAction<boolean | null>>
  }

  export interface Interface {
    authenticated: boolean
  }

  export interface Modal {
    dismissAction: () => void
  }

  export interface QRCode extends Modal {
    clientId: string
  }

  export interface Toggle {
    disabled?: boolean
    active: boolean
    onClick: () => void
  }

  export interface Waveform {
    rx: number[]
    tx: number[]
  }
}

export default Props;