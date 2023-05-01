import { Profile } from 'sgrud-realworld-core';

export function FollowButton(props: {
  children?: JSX.Element[] | undefined;
  className?: string | undefined;
  onfollow: (profile: Profile) => void;
  profile: Profile;
}): JSX.Element {
  const { onfollow, profile } = props;
  const { username, following } = profile;
  const onclick = onfollow.bind(undefined, profile);
  let className = `btn btn-sm btn${following ? '-' : '-outline-'}secondary`;

  if (props.className) {
    className += ` ${props.className}`;
  }

  return <>
    <button className={className} onclick={onclick} type="button">
      <i className="ion-plus-round"></i>{' '}
      {following ? 'Unfollow' : 'Follow'} {username}
    </button>
  </>;
}
