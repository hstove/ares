import App, { Container } from 'next/app';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { configure } from 'radiks';
import { UserSession, AppConfig } from 'blockstack';
import theme from '../lib/theme';

const makeUserSession = () => {
  const appConfig = new AppConfig(['store_write', 'publish_data'], process.env.RADIKS_API_SERVER);
  return new UserSession({ appConfig });
};

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const userSession = makeUserSession();
    let pageProps = {
      userSession,
    };

    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps: { ...pageProps, userSession, makeUserSession } };
  }

  componentWillMount() {
    const userSession = makeUserSession();
    configure({
      apiServer: process.env.RADIKS_API_SERVER,
      userSession,
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    );
  }
}
