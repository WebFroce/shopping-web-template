import { Link } from 'react-router-dom'
import { useSiteConfig } from '../../context/SiteConfigContext'

function Error() {
    const { t } = useSiteConfig();
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center py-5 mt-5 ">
            <h1 className="display-1 fw-bold">404</h1>
            <p className='mt-3'>{t("notFoundTitle")}</p>
            <Link to="/" className='btn btn-dark fs-5 mt-3'>{t("backHome")}</Link>
        </div>
    )
}

export default Error
