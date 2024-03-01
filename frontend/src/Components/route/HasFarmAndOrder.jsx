export const HasFarmAndOrder = ({ children }) => {
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
