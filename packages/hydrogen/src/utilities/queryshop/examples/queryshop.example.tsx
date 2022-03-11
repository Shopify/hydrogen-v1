export default function api(request, {queryShop}) {
  return await queryShop({
    query: `query ShopName { shop { name } }`,
  });
}
