import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Tooltip, Avatar } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import Layout from '../../../../components/layout/Layout';

export const UserPubliProfile = () => {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadUser();
  }, [username]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/public/profile/${username}`);

      setUser(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Layout title={user.user && user.user.name}>
      <Fragment>
        <div className="jumbotron  square mb-5 my-2 p-5 mt-5">
          <div className="row">
            <div className="col-md-8 ">
              <h1 className="display-6 text-white my-3">
                <h1 className="text-light font-weight-bold text-white">
                  {user.user && user.user.name}
                </h1>

                <p className="lead">
                  Joined : {user.user && moment(user.user.createdAt).fromNow()}
                </p>
                <p className="lead">
                  {' '}
                  Total Blogs :{' '}
                  <Avatar
                    style={{
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    {user.total && user.total}
                  </Avatar>
                  {/* {user.user &&
                  user.blogs &&
                  user.blogs.map((blog, i) => <div>{blog.length}</div>)} */}
                </p>
              </h1>
              <p>
                <Avatar
                  style={{
                    margin: '3px',
                    paddinng: '10px',
                  }}
                >
                  <Tooltip
                    title={user.user && user.user.name + ` Twitter handle`}
                    color="#1DA1F2"
                  >
                    <a href={``} target="_blank" rel="noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                  </Tooltip>
                </Avatar>
                <Avatar
                  style={{
                    margin: '3px',
                  }}
                >
                  <Tooltip
                    title={user.user && user.user.name + ` LinkInd handle`}
                    color="#0A66C2"
                  >
                    <a href={``} target="_blank" rel="noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                  </Tooltip>
                </Avatar>
                <Avatar
                  style={{
                    margin: '3px',
                  }}
                >
                  <Tooltip
                    title={user.user && user.user.name + ` Facebook handle`}
                    color="#1877F2"
                  >
                    <a
                      href={user.user && user.user.facebook}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                  </Tooltip>
                </Avatar>
              </p>
              <p className="lead text-white">{user.user && user.user.bio}</p>
            </div>
            <div className="col-md-4">
              {user.user && user.user.profileImage ? (
                <Avatar
                  size={305}
                  src={
                    user.user &&
                    user.user.profileImage &&
                    user.user.profileImage.Location
                  }
                />
              ) : (
                <Avatar size={305} src={user.user && user.user.picture} />
              )}
            </div>

            {/* {blog && (
            <div className="col-md-4 my-3">
              <div className="card">
                <img
                  src={blog.image && blog.image.Location}
                  alt={blog.title}
                  style={{ height: '270px', objectFit: 'cover' }}
                  className="card-img-top "
                />
              </div>
            </div>
          )} */}
          </div>
        </div>
        <h5 className="text-center">
          Recent Blogs Created By {user.user && user.user.name}
        </h5>
        <hr />
        <div className="container">
          <div className="row">
            {user.user &&
              user.blogs &&
              user.blogs.map((blog, index) => (
                <ul key={blog._id}>
                  <Link href={`/resources/${blog.slug}`}>
                    <a>
                      <li className="display-5">{blog.title}</li>
                    </a>
                  </Link>
                </ul>
              ))}
          </div>
        </div>
        {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}
      </Fragment>
    </Layout>
  );
};

export default UserPubliProfile;
