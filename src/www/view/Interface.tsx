import { Plus } from "lucide-react";
import { translate } from "../data/Translator";

import Clients from "./Clients";
import Props from "../data/Props";

const Interface: React.FC<Props.Interface> = ({
  authenticated
}) => {
  
  return (
    <div className="
    bg-white dark:bg-neutral-700 
    rounded-lg shadow-md 
    overflow-hidden">
      <div className="
      p-4 
      border-b dark:border-neutral-600 
      flex 
      justify-between items-center">
        <h2 className="
        text-2xl font-medium">
          {translate('clients')}
        </h2>
       
        <button 
          onClick={() => { /* Implementa modale creazione */ }}
          className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700"
        >
          <Plus size={18} /> {translate('new')}
        </button>
      </div>
          
      <div className="divide-y dark:divide-neutral-600">
        <Clients authenticated={authenticated} />
      </div>
    </div>
  )
}

export default Interface;