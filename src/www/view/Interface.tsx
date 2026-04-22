import { Plus, DatabaseBackup, RefreshCw } from "lucide-react";
import { translate } from "../data/Translator";

import Clients from "./Clients";
import Props from "../data/Props";
import Button from "./Button";

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
        
        <div className="
        flex gap-2
        justify-between items-center">

          <Button onClick={() => { /*  */ }}>
            <RefreshCw size={18} /> {translate('restore')}
          </Button>

          <Button onClick={() => { /*  */ }}>
            <DatabaseBackup size={18} /> {translate('backup')}
          </Button>

          <Button onClick={() => { /*  */ }}>
            <Plus size={18} /> {translate('new')}
          </Button>
        </div>
    
      </div>
          
      <div className="divide-y dark:divide-neutral-600">
        <Clients authenticated={authenticated} />
      </div>
    </div>
  )
}

export default Interface;