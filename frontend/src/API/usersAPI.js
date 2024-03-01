import axios from "axios";

const server = import.meta.env.VITE_SERVER_ADDRESS;

export const getAllUsers = async () => {
  const response = await axios.get(`${server}/users`);
  const data = {
    users: response.data.users,
    admin: response.data.admin,
  };
  return data;
};

export const switchUserStatus = async (target, actualStatut) => {
  await axios
    .post(`${server}/users/switchStatut`, {
      target: target,
      actualStatut: actualStatut,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const isAdmin = async (userId) => {
  const response = await axios.post(`${server}/users/isAdmin`, {
    userId: userId,
  });
  return response.data;
};

export const getOrders = async (mail) => {
  const response = await axios.post(`${server}/users/getOrders`, {
    mail: mail,
  });

  return response.data;
};
export const orderDetails = async (orderId) => {
  const response = await axios.post(`${server}/users/getOrderDetails`, {
    orderId: orderId,
  });
  return response.data;
};
