export function ArticlePager(props: {
  count: number;
  limit: number;
  offset: number;
  onoffset: (offset: number) => void;
}): JSX.Element {
  const { count, limit, offset, onoffset } = props;
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(count / limit);

  return <>
    <nav>
      <ul className="pagination">
        {new Array(pages).fill(null).map((_, index) => <>
          <li className={`page-item ${index + 1 === page ? 'active' : ''}`}>
            <a className="page-link" href="#" onclick={(event) => {
              onoffset(index * limit);
              event.preventDefault();
            }}>{index + 1}</a>
          </li>
        </>)}
      </ul>
    </nav>
  </>;
}
