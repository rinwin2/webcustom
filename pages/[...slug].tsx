import React from 'react';
import { getPayloadClient } from '../getPayload';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { Type as PageType } from '../collections/Page';
import NotFound from '../components/NotFound';
import Head from '../components/Head';
import classes from '../css/page.module.css';
import RenderBlocks from '../components/RenderBlocks';

const { publicRuntimeConfig: { SERVER_URL } } = getConfig();

export type Props = {
  page?: PageType
  statusCode: number
}

const Page: React.FC<Props> = (props) => {
  const { page } = props;

  if (!page) {
    return <NotFound />;
  }

  return (
    <main className={classes.page}>
      <header>
        <h1>{page.title}</h1>
      </header>
      <div className={classes.content}>
        <Head
          title={page.meta?.title || page.title}
          description={page.meta?.description}
          keywords={page.meta?.keywords}
        />
        <RenderBlocks layout={page.layout} />
      </div>
      <footer className={classes.footer}>
        <hr />
        Next.js + Payload Server Boilerplate made by
        {' '}
        <a
          href="https://payloadcms.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Payload
        </a>
      </footer>
    </main>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug ? (ctx.params.slug as string[]).join('/') : 'home';
  console.log(`Requested slug: ${slug}`);

  const payload = await getPayloadClient();
  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!pageQuery.docs[0]) {
    ctx.res.statusCode = 404;

    return {
      props: {},
    };
  }

  return {
    props: {
      page: pageQuery.docs[0],
    },
  };
};
