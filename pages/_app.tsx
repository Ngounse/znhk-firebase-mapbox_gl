import {AuthProvider} from 'src/context/AuthContext';
import {Layout} from 'src/components/Layout';
import '@/styles/globals.css';
import {Session} from 'next-auth';
import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';

export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    // <SessionProvider session={pageProps.session}>
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
    // </SessionProvider>
  );
}
