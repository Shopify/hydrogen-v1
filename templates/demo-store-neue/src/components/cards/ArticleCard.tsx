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
          <div className="card-image">
            <Image
              alt={article.image.altText || article.title}
              className="object-cover w-full aspect-[3/2]"
              data={article.image}
              height={600}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
              width={900}
            />
          </div>
        )}
        <h2 className="mt-4 font-medium">{article.title}</h2>
        <span className="block mt-1">{article.publishedAt}</span>
      </Link>
    </li>
  );
}
