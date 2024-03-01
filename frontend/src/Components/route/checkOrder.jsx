import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Home } from "../../Views/Home";
import { getOrders } from "../../API/usersAPI";
import { useParams } from "react-router-dom";

export const CheckOrder = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userLoaded, setUserLoaded] = useState(false);
  const { user } = useClerk();
  const { orderId } = useParams();

  const order = async () => {
    const orderList = await getOrders(user.emailAddresses[0].emailAddress);
    orderList.map((order) => {
      if (order.id == orderId) {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (userLoaded) {
      order();
    }
  }, [userLoaded]);

  return loading === false ? children : <Home />;
};
