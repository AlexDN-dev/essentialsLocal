import Navbar from "../Components/global/Navbar";
import { SignUp } from "@clerk/clerk-react";
import { Footer } from "../Components/global/Footer";
import "../Styles/views/signInPage.css";

export const SignUpPage = () => {
  return (
    <div>
      <Navbar />
      <div className="signInPage">
        <h2>INSCRIPTION</h2>
        <p>
          Pas encore inscrit ? Toute l'équipe d'EssentialsLocal vous souhaite la
          bienvenue !
        </p>
      </div>
      <div className="signInPanel">
        <SignUp
          redirectUrl={"/"}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
      <Footer />
    </div>
  );
};
