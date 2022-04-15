const Footer = () => (
    <div
        className="footer d-flex justify-content-between p-5"
        data-testid="Footer"
    >
        <div className="flex-fill">
            <span>關於我們</span>
            <span className="ps-5">隱私權政策</span>
        </div>
        <div className="flex-fill text-end">
            Copyright © 2021 itemhub Inc. All rights reserved.
        </div>
    </div>
);

export default Footer;
