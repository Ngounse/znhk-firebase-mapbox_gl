import {AuthProvider} from 'src/context/AuthContext';
import {Layout} from 'src/components/Layout';
import 'styles/globals.css';
import type {AppProps} from 'next/app';

const MyApp: React.FC<AppProps> = ({Component, pageProps}) => {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
};

export default MyApp;
