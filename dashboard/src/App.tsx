import './App.css';
import { Link, Outlet } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

function App() {
    return (
        <div>
            <Header></Header>
            <h1>Bookkeeper</h1>
            <hr />
            <nav>
                <Link to="/invoices">Invoices</Link> |{' '}
                <Link to="/expenses">Expenses</Link>
            </nav>
            <Outlet />
            <Footer></Footer>
        </div>
    );
}

export default App;
