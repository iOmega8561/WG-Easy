import Api from "../data/Api";
import Props from "../data/Props";
import Toggle from "./Toggle";

const ClientRow: React.FC<Props.ClientRow> = ({
  client,
  setClients
}) => {

  const toggleEnabled = () => {
    client.enabled ? Api.disableClient(client.id) : 
                     Api.enableClient(client.id);
    Api.getClients()
      .then((clients) => {setClients(clients)});
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

        <Toggle
          active={client.enabled}
          onClick={() => toggleEnabled()}
        />
      </div>
    </section>
  );
}

export default ClientRow;