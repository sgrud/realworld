import { Errors } from 'sgrud-realworld-core';

export function ErrorMessages(props: {
  errors?: Errors | undefined;
}): JSX.Element {
  const { errors } = props;

  return <>
    {errors && <>
      <ul className="error-messages">
        {Object.keys(errors).map((key) => errors[key].map((message) => <>
          <li>{key} {message}</li>
        </>))}
      </ul>
    </>}
  </>;
}
