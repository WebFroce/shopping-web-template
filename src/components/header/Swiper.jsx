import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperData from './SwiperData'
import { useSiteConfig } from '../../context/SiteConfigContext';
import './header.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


function SlideContent({ slide, siteName }) {
    const content = (
        <>
            <img
                src={slide.image}
                className="carusell-img"
                alt={slide.title || siteName}
            />
            {slide.title && (
                <div className="carousel-slide-caption">
                    <span>{slide.title}</span>
                </div>
            )}
        </>
    );

    if (!slide.url) {
        return <div className="carousel-slide-content">{content}</div>;
    }

    const commonProps = {
        className: "carousel-slide-content",
        target: slide.open_in_new_tab ? "_blank" : undefined,
        rel: slide.open_in_new_tab ? "noreferrer" : undefined,
    };

    if (/^https?:\/\//i.test(slide.url)) {
        return <a href={slide.url} {...commonProps}>{content}</a>;
    }

    return <Link to={slide.url} {...commonProps}>{content}</Link>;
}


function SwiperCar() {
    const { config } = useSiteConfig();
    const fallbackSlides = SwiperData.map(({ src }, index) => ({
        id: `fallback-${index}`,
        image: `/${src}`,
        title: "",
        url: "",
        open_in_new_tab: false,
    }));
    const slides = config.carousel_configured
        ? config.carousel_slides
        : fallbackSlides;

    if (!slides.length) {
        return null;
    }

    return (
        <Swiper
                spaceBetween={30}
                centeredSlides={true}
                loop={slides.length > 1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: slides.length > 1,
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper mb-5"

            >
            {slides.map((slide) => (
                <SwiperSlide key={slide.id || slide.image}>
                    <SlideContent slide={slide} siteName={config.site_name} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default SwiperCar
