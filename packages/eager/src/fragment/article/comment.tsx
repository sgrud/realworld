import { Comment } from 'sgrud-realworld-core';

export function ArticleComment(props: {
  children?: JSX.Element[] | undefined;
  comment: Comment;
}): JSX.Element {
  const { children } = props;
  const { body, createdAt } = props.comment;
  const { image, username } = props.comment.author;
  const href = `/profile/${username}`;

  return <>
    <div className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>
      <div className="card-footer">
        <a className="comment-author" href={href} is="router-link">
          <img className="comment-author-img" src={image}/>
        </a>
        {' '}
        <a className="comment-author" href={href} is="router-link">
          {username}
        </a>
        <span className="date-posted">
          {new Date(createdAt).toLocaleString()}
        </span>
        {children}
      </div>
    </div>
  </>;
}
