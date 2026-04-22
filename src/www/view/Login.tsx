import { useState } from "react";
import { translate } from "../data/Translator";

import Props from "../data/Props";
import Api from "../data/Api";
import Button from "./Button";

const Login: React.FC<Props.Login> = ({
  setAuthenticated
}) => {

  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent, pw: string) => {
    e.preventDefault();

    Api.createSession(pw)
      .then(() => {
        setAuthenticated(true);
      })
  };

  return (
    <div className="
    min-h-screen flex
    bg-gray-50 dark:bg-neutral-800 
    items-center justify-center">
      <form onSubmit={(e) => {handleLogin(e, password)}} className="
      bg-white dark:bg-neutral-700 
      p-8 rounded-lg 
      shadow-md w-80">
        
        <h1 className="
        text-3xl font-medium dark:text-white
        mb-6 text-center">
          WireGuard
        </h1>
        
        <input type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={translate('password')}
        className="
        w-full p-2 mb-4 
        border rounded dark:border-neutral-600 
        dark:bg-neutral-800 dark:text-white"/>

        <Button variant="btn-lg">
          {translate('signIn')}
        </Button>

      </form>
    </div>
  );
}

export default Login;