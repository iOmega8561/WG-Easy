import React, { useState, useRef } from "react";
import { Plus, DatabaseBackup, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Api from "../data/Api";
import Props from "../data/Props";
import Button from "./components/Button";
import NewClient from "./NewClient";
import ClientRow from "./ClientRow";
import useClientStats from "../hooks/useClientStats";

const Interface: React.FC<Props.Interface> = ({ 
  authenticated 
}) => {
  const { t } = useTranslation();
  const { clients, setClients, stats } = useClientStats(authenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Api.restoreConfiguration(file).then(() => {
      Api.getClients().then(setClients)
      toast.success(t('restoreSuccess'));
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
      p-4 border-b-4 border-double 
      border-neutral-200 dark:border-neutral-600 
      flex justify-between items-center">
        <h2 className="
        text-2xl font-medium">
          {t('clients')}
        </h2>
        
        <div className="
        flex gap-2 
        items-center">
          <Button onClick={() => fileInputRef.current?.click()}>
            <RefreshCw size={18} />

            <span className="max-sm:hidden">
              {t('restore')}
            </span>
          </Button>

          <Button onClick={Api.downloadBackup}>
            <DatabaseBackup size={18} /> 

            <span className="max-sm:hidden">
              {t('backup')}
            </span>
          </Button>

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> 

            <span className="max-sm:hidden">
              {t('new')}
            </span>
          </Button>
        </div>
      </div>
  
      <div className="divide-y dark:divide-neutral-600">
        {clients.length === 0 ? (
          <div className="
          flex p-6 justify-center 
          text-lg">
            {t("noClients")}
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
          onDismiss={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Interface;