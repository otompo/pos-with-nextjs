import Layout from 'antd/lib/layout/layout';
import AdminNav from '../nav/AdminNav';
import AuthorNav from '../nav/AuthorNav';
import UserNav from '../nav/UserNav';

const Sidebar = ({ children, showNav = true }) => {
  return (
    <Layout>
      <div className="container-fluid user_dashboard" id="sidebar">
        <div className="row">
          <div>
            {showNav && <UserNav />}
            {/* <AuthorNav /> */}
          </div>

          <div className="col-md-10">{children}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Sidebar;
