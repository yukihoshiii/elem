import classNames from 'classnames';
import { LeftBar, TopBar } from '../Components/Navigate';

const MainLayout = ({ className, children }) => {
    return (
        <>
            <TopBar search={true} />
            <div className="Content">
                <LeftBar />
                <div className={classNames('UI-PAGE_BODY', className)}>
                    {children}
                </div>
            </div>
        </>
    );
}

export default MainLayout;