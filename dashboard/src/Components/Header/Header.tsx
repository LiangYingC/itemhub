import React from 'react';
import styles from './Header.module.scss';

const Header = () => (
    <div className={styles.Header} data-testid="Header">
        <h1>Header</h1>
    </div>
);

export default Header;
