import UserNav from '../nav/UserNav';
import Navbar from '../Navbar';

const AdminRoute = ({ children }) => {
  return (
    <>
      <div className="container-fluid user_dashboard">
        <div className="row">
          <div className="col-md-2">
            <div id="sidebar">
              <div className="sidebar__menu">
                <UserNav />
                {/* <AdminNav /> */}
              </div>
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

export default AdminRoute;
