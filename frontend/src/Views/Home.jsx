import { LandingPage } from "../Components/LandingPage";
import "../Styles/views/home.css";
import { Footer } from "../Components/global/Footer";

export const Home = () => {
  return (
    <>
      <LandingPage></LandingPage>
      <div className="whoContainer">
        <div>
          <img src="/pictures/home-1.jpg" alt="" />
        </div>
        <div>
          <h2>EssentialsLocal, c'est quoi ?</h2>
          <p>
            Curabitur luctus, massa eu tempor consectetur, mauris tellus
            vehicula dui, sit amet sollicitudin lacus libero eget ex. Curabitur
            congue faucibus magna, non suscipit ante laoreet nec. Sed facilisis
            mauris quam, non dignissim mauris condimentum a. Morbi quis viverra
            mauris. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Donec tempus maximus dolor, quis
            consectetur risus mollis nec. Maecenas elementum dui ac molestie
            finibus. Mauris tincidunt, nulla in mollis varius, nisi mi posuere
            justo, in scelerisque dolor tellus pretium felis.
          </p>
        </div>
      </div>
      <div className="homeCardContainer">
        <h2>Les raisons d'utiliser EssentialsLocal</h2>
        <section>
          <div className="homeCard">
            <h2>Produits Locaux de Qualité</h2>
            <p>
              Explorez une sélection de produits locaux de première qualité,
              soigneusement cultivés et élaborés pour éveiller vos papilles.
            </p>
          </div>
          <div className="homeCard">
            <h2>Soutien aux locales</h2>
            <p>
              Votre achat sur EssentialsLocal soutient directement les
              agriculteurs locaux, renforçant les communautés agricoles et
              promouvant une agriculture durable.
            </p>
          </div>
          <div className="homeCard">
            <h2>Facilité d'utilisation</h2>
            <p>
              Naviguez facilement, trouvez rapidement les produits que vous
              aimez et effectuez vos achats en toute simplicité grâce à une
              interface conviviale.
            </p>
          </div>
          <div className="homeCard">
            <h2>Le Choix de la Livraison</h2>
            <p>
              Choisissez votre mode de réception préféré : la livraison à
              domicile rapide ou l'option Click and Collect pour une expérience
              de retrait pratique.
            </p>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </>
  );
};
