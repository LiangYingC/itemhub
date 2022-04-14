import styles from './dashboard.module.scss';
import { Link, Outlet } from 'react-router-dom';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { useState } from 'react';

const Dashboard = () => {
    return (
        <div className={`${styles.dashboard}`} data-testid="Dashboard">
            <div className="d-flex">
                <Header />
                <div
                    className={
                        styles.content +
                        ' position-relative container-fluid overflow-scroll px-0 '
                    }
                >
                    <div
                        className={
                            styles.topAttr +
                            ' w-100 d-flex align-items-center bg-white p-4'
                        }
                    >
                        <div
                            role="button"
                            className={styles.hamburger + ' p-2'}
                        >
                            <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                            <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                            <div className="bg-black bg-opacity-85 w-100 rounded-pill" />
                        </div>
                        <div className="flex-fill">
                            <div className="d-flex align-items-center justify-content-between">
                                <h3 className="mb-0 bg-black-opacity-85">
                                    頁面標題
                                </h3>
                                <div className="d-flex">
                                    <a
                                        href=""
                                        className="d-flex align-items-center btn bg-light border border-secondary rounded-pill px-3 py-2"
                                    >
                                        <img
                                            className="icon pe-2"
                                            src="src/assets/images/icon-refresh.svg"
                                        />
                                        <div className="lh-1 py-1">
                                            重新整理
                                        </div>
                                    </a>
                                    <a
                                        href=""
                                        className="d-flex align-items-center btn bg-primary text-white border border--primary rounded-pill ms-3  px-3 py-2"
                                    >
                                        <img
                                            className="icon pe-2"
                                            src="src/assets/images/icon-plus.svg"
                                        />
                                        <div className="lh-1 py-1">
                                            新增裝置
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
