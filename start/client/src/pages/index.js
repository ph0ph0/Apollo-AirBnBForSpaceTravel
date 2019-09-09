import React, { Fragment } from 'react';
import { Router } from '@reach/router';

import LaunchQueryComponents from './launch';
import LaunchesQueryComponents from './launches';
import Cart from './cart';
import ProfileQueryComponents from './profile';
import { Footer, PageContainer } from '../components';

export default function Pages() {
  return (
    <Fragment>
      <PageContainer>
        <Router primary={false} component={Fragment}>
          <LaunchesQueryComponents path="/" />
          <LaunchQueryComponents path="launch/:launchId" />
          <Cart path="cart" />
          <ProfileQueryComponents path="profile" />
        </Router>
      </PageContainer>
      <Footer />
    </Fragment>
  );
}
