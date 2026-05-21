import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";
import Props from "../data/Props";
import Api from "../data/Api";
import Dialog from "./components/Dialog";

const NewClient: React.FC<Props.Dismissable> = ({
  onDismiss
}) => {
  const { t } = useTranslation();
  const [newClientName, setNewClientName] = useState("");

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;
    
    Api.createClient(newClientName).then(() => {
      const newName = newClientName;
      setNewClientName("");
      onDismiss();
      toast.success(t('clientCreated', {c: newName}));
    });      
  };

  return (
    <Dialog
      titleIcon={<Plus size={24}/>}
      titleText={t('newClient')}
      content={<>
        <input
          autoFocus
          type="text"
          placeholder={t('name')}
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
      onConfirmTitle={t('create')}
      onConfirmDisabled={!newClientName.trim()}
    />
  )
}

export default NewClient;