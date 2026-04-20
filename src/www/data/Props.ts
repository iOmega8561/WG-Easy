import Client from "./Client";
import { Dispatch, SetStateAction } from "react";

namespace Props {
    
    export interface Clients {
        clients: Client[];
        setClients: Dispatch<SetStateAction<Client[]>>
    }
    
}

export default Props;