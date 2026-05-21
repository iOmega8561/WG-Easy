import { AlertTriangle, ArrowDown, ArrowUp, Download, Edit, QrCode, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

import Api from "../data/Api";
import Props from "../data/Props";
import Toggle from "./components/Toggle";
import Button from "./components/Button";
import { translate } from "../data/Translator";
import Waveform from "./components/Waveform";
import Utility from "../data/Utility"
import Dialog from "./components/Dialog";
import EditClient from "./EditClient";

const ClientRow: React.FC<Props.ClientRow> = ({
  client,
  stats,
  onUpdate
}) => {
  const [isQRCodeShown, setIsQRCodeShown] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const triggerUpdate = (t: string) => {
    onUpdate();
    toast.success(translate(t, {c: client.name}));
  }

  const toggleEnabled = () => {
    client.enabled ? 
      Api.disableClient(client.id) 
        .then(() => triggerUpdate("clientDisabled"))  
      : 
      Api.enableClient(client.id)
        .then(() => triggerUpdate("clientEnabled"))
  }

  return (
    <section className="
    relative overflow-hidden
    border-b dark:border-neutral-600 last:border-0">
      {stats && (
        <Waveform 
          rx={stats.historyRx} 
          tx={stats.historyTx} 
        />
      )}
      
      <div key={client.id} className="
      p-4 flex transition-colors relative z-10
      justify-between items-center
      bg-white/50 dark:bg-neutral-700/50">

        <div className="
        flex flex-col
        gap-2">
          {client.name}

          <span className="
          text-sm text-gray-500 
          dark:text-neutral-400">
            {client.address}
          </span>
        </div>
        
        {stats && client.enabled && (
          <div className="
          flex-1 flex justify-end
          gap-8 items-center 
          text-sm max-md:hidden">
            <div className="
            flex flex-col 
            items-end
            text-neutral-500">

              <span className="
              flex items-center gap-1">
                <ArrowDown
                  size={14} 
                />
                <span className="
                text-neutral-800 
                dark:text-neutral-200">
                  {Utility.formatBytes(stats.rxSpeed)}/s
                </span>
              </span>
              <span className="text-xs">
                {Utility.formatBytes(client.transferRx || 0)}
              </span>
            </div>

            <div className="
            flex flex-col 
            items-end
            text-neutral-500">

              <span className="
              flex items-center gap-1 ">
                <ArrowUp
                  size={14}
                /> 
                <span className="
                text-neutral-800 
                dark:text-neutral-200">
                  {Utility.formatBytes(stats.txSpeed)}/s
                </span>
              </span>
              
              <span className="text-xs">
                {Utility.formatBytes(client.transferTx || 0)}
              </span>
            </div>
          </div>
        )}

        <div className="
        flex items-center gap-1
        w-1/3 justify-end">
          <Toggle
            active={client.enabled}
            onClick={() => toggleEnabled()}
          />

          <Button
            variant="btn-sm"
            onClick={() => setIsEditModalOpen(!isEditModalOpen)}
          >
            <Edit size={20}/>
          </Button>

          <Button
            variant="btn-sm"
            onClick={() => setIsQRCodeShown(!isQRCodeShown)}
          >
            <QrCode size={20}/>
          </Button>

          <Button
            variant="btn-sm"
            onClick={() => Api.downloadConfiguration(client.id)}
          >
            <Download size={20}/>
          </Button>

          <Button
            variant="btn-sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <Trash2 size={20}/>
          </Button>
        </div>
      </div>
    
      {isQRCodeShown && (
        <Dialog
          content={<img src={`/api/wireguard/client/${client.id}/qrcode.svg`}/>}
          onDismiss={() => setIsQRCodeShown(false)}
        />
      )}

      {isDialogOpen && (
        <Dialog
          titleIcon={<AlertTriangle size={24}/>}
          titleText={translate("deleteClient")}
          content={<>
            {translate("deleteDialog1")}
            <strong>{translate("deleteDialog2")}</strong>
          </>}
          onDismiss={() => setIsDialogOpen(false)}
          onConfirm={() => {
            Api.deleteClient(client.id)
              .then(() => triggerUpdate("clientDeleted"))
          }}
          onConfirmTitle={translate("deleteClient")}
        />
      )}

      {isEditModalOpen && (
        <EditClient
          client={client}
          onDismiss={() => setIsEditModalOpen(false)}
          onUpdate={() => {
            triggerUpdate("clientUpdated")
          }}
        />
      )}
    </section>
  );
}

export default ClientRow;