import { onError } from 'apollo-link-error';
import { Context } from '@nuxt/types';

export default function(ctx: Context) {
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error: any) => {
        const statusCode = error.message?.statusCode;
        if (!statusCode || statusCode !== 401) return;
        const isLoginPath =
          Array.isArray(error.path) &&
          error.path.find((p: string) => p === 'login');
        if (isLoginPath) return;
        ctx.redirect('/logout');
      });
    }
  });
  return {
    link: errorLink,
    httpEndpoint: process.env.GRAPHQL || 'http://localhost:4000/graphql',
    tokenName: 'apollo-token',
    inMemoryCacheOptions: {
      addTypename: false,
    },
  };
}
