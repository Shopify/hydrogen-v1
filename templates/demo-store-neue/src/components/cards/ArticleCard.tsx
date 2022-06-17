import {Image, Link} from '@shopify/hydrogen';
import type {Article} from '@shopify/hydrogen/storefront-api-types';

export function ArticleCard({
  blogHandle,
  article,
  loading,
}: {
  blogHandle: string;
  article: Article;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <li key={article.id}>
      <Link to={`/${blogHandle}/${article.handle}`}>
        {article.image && (
          <Image
            data={article.image}
            className="rounded aspect-[3/2]"
            loading={loading}
          />
        )}
        <h2 className="font-medium mt-4">{article.title}</h2>
        <span className="block mt-1">{article.publishedAt}</span>
      </Link>
    </li>
  );
}
