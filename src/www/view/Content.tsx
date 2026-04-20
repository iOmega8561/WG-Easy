import { useEffect, useState } from 'react';

import Api from '../data/Api';
import Login from './Login';
import Header from './Header';
import Interface from './Interface';

export default function Content() {

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [requiresPassword, setRequiresPassword] = useState<boolean>(true);

  useEffect(() => {
    Api.getSession()
      .then((session) => {
        setAuthenticated(session.authenticated);
        setRequiresPassword(session.requiresPassword);
      })
  }, []);

  if (authenticated === null) {
    return (
      <main>
        <div className="
        flex h-screen 
        items-center justify-center 
        dark:bg-neutral-800">
          <div className="
          animate-spin rounded-full 
          h-8 w-8 
          border-b-2 border-red-800"/>
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main>
        <Login setAuthenticated={setAuthenticated} />
      </main>
    )
  }

  return (
    <main>
      <div className="
      min-h-screen 
      bg-gray-50 dark:bg-neutral-800 
      text-gray-900 dark:text-neutral-200">
        <div className="
        container 
        max-w-3xl 
        mx-auto px-4 py-8">
          
          <Header 
            requiresPassword={requiresPassword} 
            setAuthenticated={setAuthenticated}
          />
  
          <Interface authenticated={authenticated}/>
  
        </div>
      </div>
    </main>
  );
}