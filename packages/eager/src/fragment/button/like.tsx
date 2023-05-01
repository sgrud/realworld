import { Article } from 'sgrud-realworld-core';

export function LikeButton(props: {
  article: Article;
  children?: JSX.Element[] | undefined;
  className?: string | undefined;
  onlike: (article: Article) => void;
}): JSX.Element {
  const { article, children, onlike } = props;
  const { favorited } = article;
  const onclick = onlike.bind(undefined, article);
  let className = `btn btn-sm btn${favorited ? '-' : '-outline-'}primary`;

  if (props.className) {
    className += ` ${props.className}`;
  }

  return <>
    <button className={className} onclick={onclick} type="button">
      <i className="ion-heart"></i> {children}
    </button>
  </>;
}
