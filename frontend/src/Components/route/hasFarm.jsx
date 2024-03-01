import { useState, useEffect } from "react";
import { hasFarm } from "../../API/farmsAPI";
import { useClerk } from "@clerk/clerk-react";
import { Home } from "../../Views/Home";

export const CheckHasFarm = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);
  const { user } = useClerk();

  const farm = async () => {
    const status = await hasFarm(user.emailAddresses[0].emailAddress);
    if (status !== null) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (userLoaded) {
      farm();
    }
  }, [userLoaded]);

  return loading === false ? children : <Home />;
};
