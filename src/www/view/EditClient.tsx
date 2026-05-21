import React, { useState } from "react";
import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";

import Props from "../data/Props";
import Api from "../data/Api";
import Dialog from "./components/Dialog";

const NewClient: React.FC<Props.EditClient> = ({
  client,
  onUpdate,
  onDismiss
}) => {
  const { t } = useTranslation();
  const [clientName, setClientName] = useState(client.name);
  const [clientAddr, setClientAddr] = useState(client.address);

  const updateClient = async () => {
    await Api.updateClientName(client.id, clientName)
    await Api.updateClientAddress(client.id, clientAddr)
  }

  return (
    <Dialog
      titleIcon={<Edit size={24}/>}
      titleText={t('editClient')}
      content={<div className="
        flex flex-col 
        items-center justify-center
        gap-6">
          <input
            type="text"
            placeholder={t('name')}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="text-field"
          />
          <input
            type="text"
            placeholder={t('address')}
            value={clientAddr}
            onChange={(e) => setClientAddr(e.target.value)}
            className="text-field"
          />
      </div>}
      onDismiss={onDismiss}
      onConfirm={() => { updateClient().then(onUpdate) }}
      onConfirmTitle={t('update')}
      onConfirmDisabled={!clientName.trim() || !clientAddr.trim()}
    />
  )
}

export default NewClient;