import UserNav from '../nav/UserNav';
import Navbar from '../Navbar';

const UserRoutes = ({ children, showNav = true }) => {
  return (
    <>
      <div className="container-fluid user_dashboard">
        <div className="row">
          <div className="col-md-2">
            <div id="sidebar">
              <div className="sidebar__menu">{showNav && <UserNav />}</div>
            </div>
          </div>

          <div className="col-md-10">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRoutes;
