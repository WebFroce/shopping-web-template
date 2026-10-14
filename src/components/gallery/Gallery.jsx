import Aside from "./aside/aside";
import GalleryProducts from "./product/GalleryProducts";
import Footer from "../footer/Footer";
import { useSiteConfig } from "../../context/SiteConfigContext";


function Gallery() {
  const { t } = useSiteConfig();

  return (
    <div className="container">
      <header className="gallery-heading text-center">
        <span className="section-kicker">{t("galleryEyebrow")}</span>
        <h1 className="section-title">{t("galleryTitle")}</h1>
        <p className="section-subtitle">{t("gallerySubtitle")}</p>
      </header>

      <main className="gallery-layout">
        <Aside />
        <section className="gallery-results">
          <GalleryProducts />
        </section>
      </main>

      <Footer />
    </div>
  );
}


export default Gallery;
