import React, { useState, useRef, useEffect } from "react";
import { Plus, DatabaseBackup, RefreshCw } from "lucide-react";
import { translate } from "../data/Translator";
import { toast } from "react-toastify";

import Api from "../data/Api";
import Props from "../data/Props";
import Button from "./Button";
import NewClient from "./NewClient";
import Client from "../data/Client";
import ClientRow from "./ClientRow";

const Interface: React.FC<Props.Interface> = ({ 
  authenticated 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Api.restoreConfiguration(file).then(() => {
      Api.getClients().then(setClients)
      toast.success(translate('restoreSuccess'));
    })
   
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    authenticated ? Api.getClients()
                          .then(setClients) : setClients([]);
  }, [authenticated, isModalOpen, fileInputRef]) 

  return (
    <div className="
    bg-white dark:bg-neutral-700 
    rounded-lg shadow-md 
    overflow-hidden relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept=".json" 
        className="hidden" 
      />

      <div className="
      p-4 border-b-4 border-double dark:border-neutral-600 
      flex justify-between items-center">
        <h2 className="
        text-2xl font-medium">
          {translate('clients')}
        </h2>
        
        <div className="
        flex gap-2 
        items-center">
          <Button onClick={fileInputRef.current?.click}>
            <RefreshCw size={18} /> 
            {translate('restore')}
          </Button>

          <Button onClick={() => Api.downloadBackup()}>
            <DatabaseBackup size={18} /> 
            {translate('backup')}
          </Button>

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> 
            {translate('new')}
          </Button>
        </div>
      </div>
  
      <div className="divide-y dark:divide-neutral-600">
        {clients.map(client => (
          <ClientRow 
            client={client}
            onUpdate={() => {
              Api.getClients().then(setClients)
            }}
          />
        ))}
      </div>

      {isModalOpen && (
        <NewClient 
          dismissAction={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Interface;