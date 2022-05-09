import { Link, useLocation } from 'react-router-dom';

interface Breadcrumb {
    pathName: string;
    label: string;
}

const Breadcrumbs = ({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) => {
    const location = useLocation();
    const currentPathName = location.pathname;

    return (
        <nav className="breadcrumb-wrapper" aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
                {breadcrumbs.map(({ pathName, label }) => {
                    const isActive = currentPathName === pathName;
                    return isActive ? (
                        <li
                            key={pathName}
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            {label}
                        </li>
                    ) : (
                        <li key={pathName} className="breadcrumb-item">
                            <Link to={pathName}>{label}</Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
