import { LogOut } from "lucide-react";
import { translate } from "../data/Translator";

import Api from "../data/Api";
import Props from "../data/Props"

import wgLogo from "../img/logo.png"

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
      flex items-center
      text-4xl font-medium">
        <img 
          src={wgLogo}
          width="32"
          className="mr-4"
        />

        WG-Easy
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