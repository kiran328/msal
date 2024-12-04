import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { graphConfig, loginRequest } from "./authConfig";
import { useEffect, useState } from "react";

export const ProfileData = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [graphData, setGraphData] = useState(null);

  useEffect(()=>{
    RequestProfileData();
  },[])

  function RequestProfileData() {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      });
  }

  function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "GET",
      headers: headers,
    };

    return fetch(graphConfig.graphMeEndpoint, options)
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  return (
    <div id="profile-div">
      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
      <p>Profile data</p>
      {graphData && (
        <>
          <p>
            <strong>First Name: </strong> {graphData.givenName}
          </p>
          <p>
            <strong>Last Name: </strong> {graphData.surname}
          </p>
          <p>
            <strong>Email: </strong> {graphData.userPrincipalName}
          </p>
          <p>
            <strong>Id: </strong> {graphData.id}
          </p>
        </>
      )}
    </div>
  );
};
