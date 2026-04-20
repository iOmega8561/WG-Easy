import Client from "./Client";
import { Dispatch, SetStateAction, FormEvent } from "react";

namespace Props {
    
    export interface Clients {
        authenticated: boolean
    }

    export interface Login {
        setAuthenticated: Dispatch<SetStateAction<boolean | null>>
    }
}

export default Props;