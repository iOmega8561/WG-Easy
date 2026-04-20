import { LogOut } from "lucide-react";
import { translate } from "../data/Translator";

import Api from "../data/Api";
import Props from "../data/Props"

const Header: React.FC<Props.Header> = ({
  requiresPassword,
  setAuthenticated
}) => {
  
  const handleLogout = async () => {
    Api.deleteSession()
      .then(() => {
        setAuthenticated(false);
      })
  };

  return (
    <div className="
    flex mb-8
    justify-between items-center">
      <h1 className="
      text-4xl font-medium">
        WireGuard
      </h1>

      {requiresPassword && (
        <button onClick={handleLogout} className="
        flex 
        items-center gap-1 
        text-sm text-gray-500 hover:text-red-600">
          {translate('logout')} <LogOut size={16} />
        </button>
      )}
    </div>
  )
}

export default Header;