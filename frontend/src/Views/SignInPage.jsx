import Navbar from "../Components/global/Navbar";
import { Footer } from "../Components/global/Footer";
import { SignIn } from "@clerk/clerk-react";
import "../Styles/views/signInPage.css";

export const SignInPage = () => {
  return (
    <div>
      <Navbar />
      <div className="signInPage">
        <h2>CONNEXION</h2>
        <p>
          Pour pouvoir profiter pleinement de EssentialsLocal merci de vous
          connectez au site.
        </p>
      </div>
      <div className="signInPanel">
        <SignIn
          redirectUrl={"/"}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
      <Footer></Footer>
    </div>
  );
};
