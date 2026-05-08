import { Download, QrCode, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

import Api from "../data/Api";
import Props from "../data/Props";
import Toggle from "./Toggle";
import Button from "./Button";
import { translate } from "../data/Translator";
import QRCode from "./QRCode";

const ClientRow: React.FC<Props.ClientRow> = ({
  client,
  setClients
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleEnabled = () => {
    client.enabled ? Api.disableClient(client.id) : 
                     Api.enableClient(client.id);
    Api.getClients()
      .then((clients) => {setClients(clients)});
  }

  const deleteClient = () => {
    Api.deleteClient(client.id)
      .then(() => {
        Api.getClients()
          .then((clients) => {setClients(clients)})
        
        toast.success(translate('clientDeleted'));
      })
  }

  return (
    <section>
      <div key={client.id} className="
      p-4 flex 
      justify-between items-center">
        <div>
          <div className="
          font-medium">
            {client.name}
          </div>

          <div className="
          text-sm text-gray-500">
            {client.address}
          </div>
        </div>

        <div className="
        flex items-center gap-1">
          <Toggle
            active={client.enabled}
            onClick={() => toggleEnabled()}
          />

          <Button
            variant="btn-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <QrCode size={20}/>

            {isModalOpen && (
              <QRCode clientId={client.id} />
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
            onClick={deleteClient}
          >
            <Trash2 size={20}/>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ClientRow;