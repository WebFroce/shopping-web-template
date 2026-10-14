import Footer from '../footer/Footer'
import { useSiteConfig } from '../../context/SiteConfigContext'

function ContactUs() {
    const { t } = useSiteConfig();
    return (
        <div className="container py-5">
            <div className="col-lg-5 text-center w-100 ">
                <h1 className="mb-4">{t("contactTitle")}</h1>
            </div>
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 col-lg-6">
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">{t("firstName")}</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">{t("lastName")}</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t("email")}</label>
                            <input type="email" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t("message")}</label>
                            <textarea className="form-control resize" rows="3"></textarea>
                        </div>
                        <div className="text-center">
                            <button type='button' className="btn btn-dark mt-3">{t("sendMessage")}</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ContactUs
