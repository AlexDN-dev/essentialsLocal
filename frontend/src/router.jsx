import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignInPage } from "./Views/SignInPage";
import { SignUpPage } from "./Views/SignUpPage";
import { Home } from "./Views/Home";
import { useNavigate, Routes, Route, BrowserRouter } from "react-router-dom";
import { Profile } from "./Views/Profile";
import { Support } from "./Views/Support";
import { FarmSearch } from "./Views/FarmSearch";
import { Farm } from "./Views/Farm";
import { Product } from "./Views/Product";
import { Search } from "./Views/Search";
import { HomeAdmin } from "./Views/admin/HomeAdmin";
import { UserPage } from "./Views/admin/UserPage";
import { FarmPage } from "./Views/admin/FarmPage";
import { FarmRequestPage } from "./Views/admin/FarmRequestPage";
import { FarmParams } from "./Views/FarmParams";
import { ShoppingCard } from "./Views/shoppingCard";
import { CancelPayement } from "./Views/cancelPage";
import { SuccessPayement } from "./Views/SuccessPage";
import { IsAdmin } from "./Components/route/IsAdmin";
import { OrderDetails } from "./Views/OrderDetails";
import { OrderFarmDetails } from "./Views/OrderFarmDetails";
import { DelivererPage } from "./Views/admin/DelivererPage";
import { CheckHasFarm } from "./Components/route/hasFarm";
import { CheckOrder } from "./Components/route/checkOrder";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ClerkWithRoutes = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/searchFarm" element={<FarmSearch />} />
        <Route path="/farm/:farmId" element={<Farm />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/search/:item?" element={<Search />} />
        <Route
          path="/farmParams"
          element={
            <CheckHasFarm>
              <FarmParams />
            </CheckHasFarm>
          }
        />
        <Route
          path="/shoppingCard"
          element={
            <>
              <SignedIn>
                <ShoppingCard />
              </SignedIn>
              <SignedOut>
                <Home />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <IsAdmin>
              <HomeAdmin />
            </IsAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <IsAdmin>
              <UserPage />
            </IsAdmin>
          }
        />
        <Route
          path="/admin/farms"
          element={
            <IsAdmin>
              <FarmPage />
            </IsAdmin>
          }
        />
        <Route
          path="/admin/support"
          element={
            <IsAdmin>
              <FarmRequestPage />
            </IsAdmin>
          }
        />
        <Route
          path="/admin/deliverer"
          element={
            <IsAdmin>
              <DelivererPage />
            </IsAdmin>
          }
        />
        <Route path="/payement/success" element={<SuccessPayement />} />
        <Route path="/payement/cancel" element={<CancelPayement />} />
        <Route
          path="/profile"
          element={
            <>
              <SignedIn>
                <Profile />
              </SignedIn>
              <SignedOut>
                <Home />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/profile/order/:orderId"
          element={
            <CheckOrder>
              <OrderDetails />
            </CheckOrder>
          }
        />
        <Route
          path="/farmParams/:farmId/order/:orderId"
          element={<OrderFarmDetails />}
        />
      </Routes>
    </ClerkProvider>
  );
};

export const RouterManager = () => {
  return (
    <BrowserRouter>
      <ClerkWithRoutes />
    </BrowserRouter>
  );
};
