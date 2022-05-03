import { Fragment } from 'react';
import { Avatar } from 'antd';
const Card = (props) => {
  return (
    <Fragment>
      <div className="col-md-3">
        <div className="card admin_card">
          <div className="card-body">
            <h5 className="card-title">
              {props.icon}
              {props.cade_title}
            </h5>
            <p>
              <h6 display="4" className="lead py-3">
                {
                  <Avatar
                    size={70}
                    style={{
                      backgroundColor: '#f56a00',
                      fontSize: '25px',
                      border: '3px solid #fff',
                    }}
                  >
                    {props.cade_total}
                  </Avatar>
                }
              </h6>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Card;
