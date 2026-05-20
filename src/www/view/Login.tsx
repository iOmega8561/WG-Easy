import { useState } from "react";
import { translate } from "../data/Translator";

import Props from "../data/Props";
import Api from "../data/Api";
import Button from "./components/Button";

import wgLogo from "../img/logo.png";

const Login: React.FC<Props.Dismissable> = ({
  onDismiss
}) => {

  const [password, setPassword] = useState('');

  const handleLogin = (
    e: React.SubmitEvent, 
    pw: string
  ) => {
    e.preventDefault();

    Api.createSession(pw)
      .then(() => {
        onDismiss();
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
        flex items-center justify-center
        text-3xl font-medium dark:text-white
        mb-6 text-center">
          <img 
            src={wgLogo}
            width="24"
            className="mr-2"
          />
          
          WG-Easy
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