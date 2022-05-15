import { Link } from 'react-router-dom';

const Footer = () => (
    <div
        className="footer d-flex justify-content-between p-5 fs-5"
        data-testid="Footer"
    >
        <div className="flex-fill text-end text-black text-opacity-65">
            Copyright © 2021 itemhub Inc. All rights reserved.
        </div>
    </div>
);

export default Footer;
