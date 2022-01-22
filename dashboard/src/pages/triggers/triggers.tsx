import { Link } from 'react-router-dom';
import styles from './triggers.module.scss';

const Triggers = () => (
    <div className={styles.Triggers} data-testid="Triggers">
        Triggers Component
        <br />
        <Link to="/triggers/1">No 1 Trigger</Link>
    </div>
);

export default Triggers;
