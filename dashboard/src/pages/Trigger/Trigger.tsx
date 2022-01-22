import styles from './trigger.module.scss';
import { Link, useParams } from 'react-router-dom';

const Trigger = () => {
    let { id } = useParams();
    return (
        <div className={styles.Trigger} data-testid="Trigger">
            Trigger Component <br />
            id: {id} <br />
            <Link to="../triggers">Back</Link>
        </div>
    );
};

export default Trigger;
