import React, { Fragment } from 'react';
import TopTitle from '../../components/home/TopTitle';
import Layout from '../../components/layout/Layout';
import ServicesAccordion from '../../components/home/ServicesAccordion';

const Index = () => {
  return (
    <Fragment>
      <Layout title="Our Services">
        <div className="container-fluid  industries-bnr">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="text-center" style={{ marginTop: '150px' }}>
                <TopTitle
                  welc={'Services'}
                  slogan={
                    'Our style is natural and we delivers great service that can benefit all kinds of people'
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <ServicesAccordion />
      </Layout>
    </Fragment>
  );
};

export default Index;
