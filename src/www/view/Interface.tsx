import React, { useState, useRef } from "react";
import { Plus, DatabaseBackup, RefreshCw } from "lucide-react";
import { translate } from "../data/Translator";
import { toast } from "react-toastify";

import Api from "../data/Api";
import Clients from "./Clients";
import Props from "../data/Props";
import Button from "./Button";
import NewClient from "./NewClient";

const Interface: React.FC<Props.Interface> = ({ 
  authenticated 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Api.restoreConfiguration(file).then(() => {
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
      p-4 border-b dark:border-neutral-600 
      flex justify-between items-center">
        <h2 className="
        text-2xl font-medium">
          {translate('clients')}
        </h2>
        
        <div className="
        flex gap-2 
        items-center">
          <Button onClick={handleRestoreClick}>
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
        <Clients authenticated={authenticated} />
      </div>

      {isModalOpen && (
        <NewClient setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default Interface;