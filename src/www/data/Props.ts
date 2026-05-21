// eslint-disable @typescript-eslint/no-namespace

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

  export interface Dialog extends Dismissable {
    titleIcon?: React.ReactNode
    titleText?: string
    content: React.ReactNode
    onConfirm?: () => void
    onConfirmTitle?: string
    onConfirmDisabled?: boolean
  }

  export interface Dismissable {
    onDismiss: () => void
  }

  export interface EditClient extends Dismissable {
    client: Client,
    onUpdate: () => void
  }

  export interface Header {
    requiresPassword: boolean
    setAuthenticated: Dispatch<SetStateAction<boolean | null>>
  }

  export interface Interface {
    authenticated: boolean
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