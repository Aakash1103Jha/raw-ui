import { useUploader } from '@/hooks';
import Head from 'next/head';

export default function Home() {
  const { Uploader } = useUploader();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", height: "100vh", }}>
        <Uploader />
      </main>
    </>
  );
}
