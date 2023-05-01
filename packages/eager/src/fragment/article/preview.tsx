import { Article } from 'sgrud-realworld-core';
import { LikeButton } from '../button/like';
import { ArticleMeta } from './meta';
import { ArticleTags } from './tags';

export function ArticlePreview(props: {
  article: Article;
  onlike: (article: Article) => void;
}): JSX.Element {
  const { article, onlike } = props;
  const { description, favoritesCount, slug, tagList, title } = article;

  return <>
    <div className="article-preview">
      <ArticleMeta article={article}>
        <LikeButton
          article={article}
          className="pull-xs-right"
          onlike={onlike}>
          {favoritesCount}
        </LikeButton>
      </ArticleMeta>
      <a className="preview-link" href={`/article/${slug}`} is="router-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <ArticleTags tagList={tagList}/>
      </a>
    </div>
  </>;
}
