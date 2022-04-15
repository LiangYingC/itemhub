import { Link } from 'react-router-dom';

const Footer = () => (
    <div
        className="footer d-flex justify-content-between p-5 h6"
        data-testid="Footer"
    >
        <div className="flex-fill">
            <Link
                to="/dashboard/"
                className="text-decoration-none text-black text-opacity-65"
            >
                關於我們
            </Link>
            <Link
                to="/dashboard/"
                className="text-decoration-none text-black text-opacity-65 ps-5"
            >
                隱私權政策
            </Link>
        </div>
        <div className="flex-fill text-end text-black text-opacity-65">
            Copyright © 2021 itemhub Inc. All rights reserved.
        </div>
    </div>
);

export default Footer;
