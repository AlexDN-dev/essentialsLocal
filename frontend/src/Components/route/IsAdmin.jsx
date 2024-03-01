import { useState, useEffect } from "react";
import { isAdmin } from "../../API/usersAPI";
import { useClerk } from "@clerk/clerk-react";
import { Home } from "../../Views/Home";

export const IsAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);
  const { user } = useClerk();

  const admin = async () => {
    const status = await isAdmin(user.id);
    setLoading(!status);
  };

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (userLoaded) {
      admin();
    }
  }, [userLoaded]);

  return loading === false ? children : <Home />;
};
