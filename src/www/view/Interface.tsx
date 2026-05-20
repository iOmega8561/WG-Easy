import React, { useState, useRef, useEffect } from "react";
import { Plus, DatabaseBackup, RefreshCw } from "lucide-react";
import { translate } from "../data/Translator";
import { toast } from "react-toastify";

import Api from "../data/Api";
import Props from "../data/Props";
import Button from "./Button";
import NewClient from "./NewClient";
import ClientRow from "./ClientRow";
import useClientStats from "../hooks/useClientStats";

const Interface: React.FC<Props.Interface> = ({ 
  authenticated 
}) => {
  const { clients, setClients, stats } = useClientStats(authenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <Button onClick={() => fileInputRef.current?.click()}>
            <RefreshCw size={18} />

            <span className="max-sm:hidden">
              {translate('restore')}
            </span>
          </Button>

          <Button onClick={Api.downloadBackup}>
            <DatabaseBackup size={18} /> 

            <span className="max-sm:hidden">
              {translate('backup')}
            </span>
          </Button>

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> 

            <span className="max-sm:hidden">
              {translate('new')}
            </span>
          </Button>
        </div>
      </div>
  
      <div className="divide-y dark:divide-neutral-600">
        {clients.length === 0 ? (
          <div className="
          flex p-6 justify-center 
          text-lg">
            {translate("noClients")}
          </div>
        ) : (clients.map(client => (
          <ClientRow 
            client={client}
            stats={stats[client.id]}
            onUpdate={() => {
              Api.getClients().then(setClients)
            }}
          />
        )))}
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