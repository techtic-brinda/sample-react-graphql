import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme';
import { initializeStore } from '../src/store'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { apolloClient } from '../src/apollo';
import Subscriptions from '../components/subscriptions';
import { ApolloProvider } from '@apollo/react-hooks';
import { NoSsr } from '../components/common'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from './../packages/react-toasts';
import './styles.css'
class MyApp extends App {

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

  }


  getServerSideProps() {
    return {}
  }

  getInitialProps({ req }) {

    return { isServer: !!req };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <React.Fragment>
        <NoSsr>
          <Head>
            <title>Orphan Angels</title>
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <style>
              @import url('https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900&display=swap');
          </style>
          <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
          </Head>
          {/* {!isServer && <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />} */}
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
          <ApolloProvider client={apolloClient}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Subscriptions />
                <Component {...pageProps} />
              </ThemeProvider>
            </Provider>
          </ApolloProvider>
        </NoSsr>
      </React.Fragment>
    );
  }
}


export default withRedux(initializeStore)(MyApp)
