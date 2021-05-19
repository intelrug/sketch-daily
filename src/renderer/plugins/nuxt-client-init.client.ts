export default async (context: any) => {
  await context.store.dispatch('nuxtClientInit', context);
};
