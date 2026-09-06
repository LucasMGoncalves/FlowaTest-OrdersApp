import { useState } from "react";

import { LoginPage } from "./pages/LoginPage";
import { OrderPage } from "./pages/OrderPage";

function App() {
  const [authenticated, setAuthenticated] =
    useState<boolean>(
      () => Boolean(localStorage.getItem("access_token"))
    );

  if (!authenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setAuthenticated(true);
        }}
      />
    );
  }

  return <OrderPage />;
}

export default App;