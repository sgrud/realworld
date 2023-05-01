import { Article, Articles } from 'sgrud-realworld-core';
import { ArticlePager } from './pager';
import { ArticlePreview } from './preview';

export function ArticleList(props: Articles & {
  onlike: (article: Article) => void;
  onoffset: (offset: number) => void;
}): JSX.Element {
  const { articles, articlesCount, limit, offset, onlike, onoffset } = props;

  return articlesCount ? <>
    {articles.map((article) => <>
      <ArticlePreview
        article={article}
        onlike={onlike}>
      </ArticlePreview>
    </>)}
    {articles.length < articlesCount && <>
      <ArticlePager
        count={articlesCount}
        limit={limit}
        offset={offset}
        onoffset={onoffset}>
      </ArticlePager>
    </>}
  </> : <>
    <div className="article-preview">
      No articles are here... yet.
    </div>
  </>;
}
