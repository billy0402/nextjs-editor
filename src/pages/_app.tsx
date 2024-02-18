import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Provider } from 'react-redux';

import wrapper from '@/redux/store';
import '@/styles/globals.scss';

const App = ({ Component, ...pageProps }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(pageProps);

  return (
    <Provider store={store}>
      <Head>
        <title>Next.js Editor</title>
      </Head>
      <Component {...props.pageProps} />
    </Provider>
  );
};

export default App;
