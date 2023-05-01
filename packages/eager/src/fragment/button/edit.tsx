import { Article } from 'sgrud-realworld-core';

export function EditButton(props: {
  article: Article;
  className?: string | undefined;
}): JSX.Element {
  const { slug } = props.article;
  let className = 'btn btn-sm btn-outline-secondary';

  if (props.className) {
    className += ` ${props.className}`;
  }

  return <>
    <a className={className} href={`/editor/${slug}`} is="router-link">
      <i className="ion-edit"></i> Edit Article
    </a>
  </>;
}
