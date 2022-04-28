import React, { Fragment } from 'react';

const TopTitle = ({ cname, welc, slogan }) => {
  return (
    <Fragment>
      <span className="text-center save">
        <h1>{welc}</h1>

        <h5
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff000',
            // color: '#f58220',
            // height: 50,
            // width: 50,
            // borderRadius: 25,
            // backgroundColor: 'red',
          }}
        >
          {cname}
        </h5>

        <h3>
          <p className="lead">{slogan}</p>
        </h3>
      </span>
    </Fragment>
  );
};

export default TopTitle;
