import React, { useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

import { loginRequest } from "./authConfig";
import { ProfileData } from "./Profile";

const App = () => {
  const { instance, accounts } = useMsal();
  const [initialized, setInitialized] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const boot = async () => {
      const msalConfig = {
        auth: {
          clientId: "bfb5e991-8de7-4912-801c-3bf2daa3e7f6",
        },
      };
      const msalInstance = new PublicClientApplication(msalConfig);
      await msalInstance.initialize();
      setInitialized(true);
    };
    boot();
  }, []);

  useEffect(() => {
    if(accounts.length === 0) return;
    let timer = setTimeout(() => {
      if (!isAuthenticated && initialized) {
        handleLogin();
      }
    }, 1000);
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [accounts.length, initialized]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  return (
    <div>
      {!initialized && <p>Initializing....</p>}
      {initialized && accounts.length == 0 && (
        <button onClick={handleLogin}>Sign In</button>
      )}
      {accounts.length > 0 && <ProfileData />}
    </div>
  );
};

export default App;
