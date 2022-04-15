import { Outlet } from 'react-router-dom';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';

const Dashboard = () => {
    return (
        <div className="dashboard" data-testid="Dashboard">
            <div className="d-flex">
                <Header />
                <div className="content position-relative container-fluid overflow-scroll px-0 ">
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
