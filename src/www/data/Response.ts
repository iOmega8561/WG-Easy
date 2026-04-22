namespace Response {
  export interface Session {
    requiresPassword: boolean;
    authenticated: boolean;
  }

  export interface Success {
    success: boolean;
  }
}

export default Response;