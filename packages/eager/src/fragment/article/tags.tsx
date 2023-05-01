export function ArticleTags(props: {
  tagList: string[];
}): JSX.Element {
  const { tagList } = props;

  return <>
    {tagList.length > 0 && <>
      <ul className="tag-list">
        {tagList.map((tag) => <>
          <li className="tag-default tag-outline tag-pill">{tag}</li>
        </>)}
      </ul>
    </>}
  </>;
}
