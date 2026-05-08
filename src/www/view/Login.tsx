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
    bg-white dark:bg-neutral-700 
    modal-container">
      <form 
        onSubmit={(e) => {handleLogin(e, password)}} 
        className="modal-content p-6"
      >
        <h1 className="
        text-3xl font-medium dark:text-white
        mb-6 text-center">
          WireGuard
        </h1>
        
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={translate('password')}
          className="text-field mb-4"
        />

        <Button variant="btn-lg">
          {translate('signIn')}
        </Button>
      </form>
    </div>
  );
}

export default Login;