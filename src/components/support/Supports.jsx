import { useSiteConfig } from "../../context/SiteConfigContext";


function Supports() {
  const { t } = useSiteConfig();
  const supportData = [
    { image: "freeShipping.png", header: t("freeShipping"), title: t("freeShippingText") },
    { image: "support.png", header: t("guarantee"), title: t("guaranteeText") },
    { image: "customersupport.png", header: t("customerSupport"), title: t("customerSupportText") },
  ];

  return (
    <section className="support-strip">
      {supportData.map(({ image, header, title }) => (
        <article className="support-item" key={title}>
          <div className="support-icon-wrap">
            <img src={`/${image}`} alt="" className="support-icon" />
          </div>
          <div>
            <h3>{header}</h3>
            <p>{title}</p>
          </div>
        </article>
      ))}
    </section>
  );
}


export default Supports;
