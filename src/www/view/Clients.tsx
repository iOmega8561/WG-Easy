import Client from "../data/Client";
import Api from "../data/Api";
import Props from "../data/Props";

const Clients: React.FC<Props.Clients> = ({
  clients,
  setClients
}) => {

  const toggleEnabled = async (client: Client) => {
    client.enabled ? Api.disableClient(client.id) : 
                     Api.enableClient(client.id);

    setClients(await Api.getClients());
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

          <div className="
          flex 
          gap-2">
            <div onClick={() => toggleEnabled(client)} className={`
            w-10 h-6 px-1 
            rounded-full 
            cursor-pointer 
            flex items-center 
            ${client.enabled ? 'bg-red-800 justify-end' : 
                               'bg-gray-300 dark:bg-neutral-500 justify-start'}`}>
              <div className="
              w-4 h-4 
              bg-white rounded-full shadow-sm"/>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Clients;