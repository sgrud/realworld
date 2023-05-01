import { Article } from 'sgrud-realworld-core';

export function ArticleMeta(props: {
  article: Article;
  children?: JSX.Element[] | undefined;
}): JSX.Element {
  const { children } = props;
  const { image, username } = props.article.author;
  const createdAt = new Date(props.article.createdAt).toLocaleString();
  const href = `/profile/${username}`;

  return <>
    <div className="article-meta">
      <a href={href} is="router-link"><img src={image}/></a>
      <div className="info">
        <a className="author" href={href} is="router-link">{username}</a>
        <span className="date">{createdAt}</span>
      </div>
      {children}
    </div>
  </>;
}
