import Client from "../data/Client";
import Api from "../data/Api";
import Props from "../data/Props";
import { useEffect, useState } from "react";
import Toggle from "./Toggle";

const Clients: React.FC<Props.Clients> = ({
  authenticated
}) => {

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    authenticated ? 
      Api.getClients()
        .then(setClients) :
      setClients([]);
  }, [authenticated]) 

  const toggleEnabled = async (client: Client) => {
    client.enabled ? Api.disableClient(client.id) : 
                     Api.enableClient(client.id);

    Api.getClients()
      .then(setClients);
  }

  return (
    <section>
      {clients.map(client => (
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

          <Toggle
            active={client.enabled}
            onClick={() => toggleEnabled(client)}
          />
        </div>
      ))}
    </section>
  );
}

export default Clients;