import Jumping from 'src/View/Jump';
import Head from 'next/head';
import {NextPage} from 'next';

const Todos: NextPage = () => {
  return (
    <>
      <Head>
        <title>Jump</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Jumping />
    </>
  );
};

export default Todos;