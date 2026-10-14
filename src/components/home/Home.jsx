import Head from '../header/Head'
import Body from './Body';
import Footer from '../footer/Footer';
import './home.css';

function Home() {
    return (
        <div className="container">
            <Head />
            <Body />
            <Footer/>
        </div>
    )
}

export default Home
