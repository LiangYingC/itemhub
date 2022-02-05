import styles from './triggers.module.scss';
import { Link } from 'react-router-dom';

const Triggers = () => (
    <div className={styles.Triggers} data-testid="Triggers">
        Triggers Component
        <br />
        <Link to="/dashboard/triggers/1">No 1 Trigger</Link>
    </div>
);

export default Triggers;
