import { Download, Pencil, QrCode, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRef, useState } from "react";

import Api from "../data/Api";
import Props from "../data/Props";
import Toggle from "./Toggle";
import Button from "./Button";
import { translate } from "../data/Translator";
import QRCode from "./QRCode";
import Dialog from "./Dialog";
import Editable from "./Editable";

const ClientRow: React.FC<Props.ClientRow> = ({
  client,
  onUpdate
}) => {
  const [isQRCodeShown, setIsQRCodeShown] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const triggerUpdate = (t: string) => {
    onUpdate();
    toast.success(translate(t));
  }

  const toggleEnabled = () => {
    client.enabled ? 
      Api.disableClient(client.id) 
        .then(() => triggerUpdate("clientUpdated"))  
      : 
      Api.enableClient(client.id)
        .then(() => triggerUpdate("clientUpdated"))
  }
  
  return (
    <section>
      <div key={client.id} className="
      p-4 flex 
      justify-between items-center">
        <div>
          <Editable 
            value={client.name} 
            onConfirm={(newName) => {
              Api.updateClientName(client.id, newName)
                .then(() => triggerUpdate("clientUpdated"))
            }} 
          />

          <Editable 
            value={client.address} 
            onConfirm={(newAddr) => {
              Api.updateClientAddress(client.id, newAddr)
                .then(() => triggerUpdate("clientUpdated"))
            }} 
          />
        </div>

        <div className="
        flex items-center gap-1">
          <Toggle
            active={client.enabled}
            onClick={() => toggleEnabled()}
          />

          <Button
            variant="btn-sm"
            onClick={() => setIsQRCodeShown(!isQRCodeShown)}
          >
            <QrCode size={20}/>

            {isQRCodeShown && (
              <QRCode
                dismissAction={() => setIsQRCodeShown(false)}
                clientId={client.id}
              />
            )}
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

      {isDialogOpen && (
        <Dialog
          dismissAction={() => setIsDialogOpen(false)}
          onConfirm={() => {
            Api.deleteClient(client.id)
              .then(() => triggerUpdate("clientDeleted"))
          }}
        />
      )}
    </section>
  );
}

export default ClientRow;