import { Article } from 'sgrud-realworld-core';

export function DeleteButton(props: {
  article: Article;
  className?: string | undefined;
  ondelete: (article: Article) => void;
}): JSX.Element {
  const { article, ondelete } = props;
  const onclick = ondelete.bind(undefined, article);
  let className = 'btn btn-sm btn-outline-danger';

  if (props.className) {
    className += ` ${props.className}`;
  }

  return <>
    <button className={className} onclick={onclick} type="button">
      <i className="ion-trash-a"></i> Delete Article
    </button>
  </>;
}
