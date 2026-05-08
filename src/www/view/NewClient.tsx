import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";

import { translate } from "../data/Translator";
import Button from "./Button";
import Props from "../data/Props";
import Api from "../data/Api";

const NewClient: React.FC<Props.Modal> = ({
  dismissAction
}) => {

  const [newClientName, setNewClientName] = useState("");

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;
    
    Api.createClient(newClientName).then(() => {
      setNewClientName("");
      dismissAction();
      toast.success(translate('clientCreated'));
    });      
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="p-6">

          <h3 className="
          text-xl font-semibold 
          mb-4 dark:text-white">
            {translate('newClient')}
          </h3>
          
          <input
            autoFocus
            type="text"
            placeholder={translate('name')}
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateClient()}
            className="text-field"
          />

        </div>

        <div className="
        flex justify-between
        py-2 px-6
        border-t dark:border-neutral-600">
          <Button 
            onClick={() => { 
              dismissAction(); 
              setNewClientName(""); 
            }}
          >
            <X size={16} /> 
            {translate('cancel')}
          </Button>
          
          <Button 
            disabled={!newClientName.trim()}
            onClick={handleCreateClient} 
          >
            <Check size={16} /> 
            {translate('create')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewClient;