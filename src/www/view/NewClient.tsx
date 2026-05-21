import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { translate } from "../data/Translator";
import Props from "../data/Props";
import Api from "../data/Api";
import Dialog from "./components/Dialog";

const NewClient: React.FC<Props.Dismissable> = ({
  onDismiss
}) => {
  const [newClientName, setNewClientName] = useState("");

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;
    
    Api.createClient(newClientName).then(() => {
      const newName = newClientName;
      setNewClientName("");
      onDismiss();
      toast.success(translate('clientCreated', {c: newName}));
    });      
  };

  return (
    <Dialog
      titleIcon={<Plus size={24}/>}
      titleText={translate('newClient')}
      content={<>
        <input
          autoFocus
          type="text"
          placeholder={translate('name')}
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateClient()}
          className="text-field"
        />
      </>}
      onDismiss={() => {
        onDismiss(); 
        setNewClientName(""); 
      }}
      onConfirm={handleCreateClient}
      onConfirmTitle={translate('create')}
      onConfirmDisabled={!newClientName.trim()}
    />
  )
}

export default NewClient;