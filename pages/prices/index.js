import React, { Fragment } from 'react';
import TopTitle from '../../components/home/TopTitle';
import Layout from '../../components/layout/Layout';
import OurPrices from '../../components/home/OurPrices';
import ShowPrices from '../../components/home/ShowPrices';

const Index = () => {
  return (
    <Fragment>
      <Layout title="Our Prices">
        <div className="container-fluid  industries-bnr">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="text-center" style={{ marginTop: '150px' }}>
                <TopTitle
                  welc={'Prices'}
                  slogan={
                    'Our style is natural and we delivers great service that can benefit all kinds of people'
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <ShowPrices />
      </Layout>
    </Fragment>
  );
};

export default Index;
