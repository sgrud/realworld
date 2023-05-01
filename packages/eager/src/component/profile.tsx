import { assign, Factor } from '@sgrud/core';
import { Component, Fluctuate, Resolve, Route, Router } from '@sgrud/shell';
import { Store } from '@sgrud/state';
import { first, from, of, switchMap } from 'rxjs';
import { Article, Articles, Endpoint, Profile, UserStore } from 'sgrud-realworld-core';
import { ArticleList } from '../fragment/article/list';
import { FollowButton } from '../fragment/button/follow';

declare global {
  interface HTMLElementTagNameMap {
    'profile-component': ProfileComponent;
  }
}

@Route({
  path: 'profile/:username/:favorites?'
})
@Component('profile-component')
export class ProfileComponent extends HTMLElement implements Component {

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => Router)
  private readonly router!: Router;

  @Fluctuate(() => new Router())
  private readonly routerState?: Router.State | undefined;

  @Fluctuate(() => new UserStore())
  private readonly userState?: Store.State<UserStore> | undefined;

  @Resolve<'profile/:username/:favorites?'>(({ params }) => {
    return Endpoint.readArticles({
      [params.favorites ? 'favorited' : 'author']: params.username
    });
  })
  private articles!: Articles;

  @Resolve<'profile/:username/:favorites?'>(({ params }) => {
    return from(new UserStore()).pipe(first(), switchMap((userState) => {
      return params.username !== userState.username
        ? Endpoint.readProfile(params.username)
        : of(userState);
    }));
  })
  private readonly profile!: Profile;

  public get template(): JSX.Element {
    return <>
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-md-10 col-xs-12 offset-md-1">
                <img className="user-img" src={this.profile.image}/>
                <h4>{this.profile.username}</h4>
                <p>{this.profile.bio}</p>
                {this.profile.username === this.userState?.username ? <>
                  <a
                    className="btn btn-sm btn-outline-secondary action-btn"
                    href="/settings"
                    is="router-link">
                    <i className="ion-gear-a"></i> Edit Profile Settings
                  </a>
                </> : <>
                  <FollowButton
                    className="action-btn"
                    onfollow={() => this.updateFollow()}
                    profile={this.profile}>
                  </FollowButton>
                </>}
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-xs-12 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <a {...this.navLink()}>My Articles</a>
                  </li>
                  <li className="nav-item">
                    <a {...this.navLink('favorites')}>Favorited Articles</a>
                  </li>
                </ul>
              </div>
              <ArticleList {...this.articles}
                onlike={(article) => this.updateLike(article)}
                onoffset={(offset) => this.readArticles({ offset })}>
              </ArticleList>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  private navLink(...parts: string[]): HTMLAnchorElement {
    const props = {
      className: 'nav-link',
      href: `/profile/${[this.profile.username].concat(parts).join('/')}`,
      is: 'router-link'
    };

    if (this.routerState?.path === this.router.rebase(props.href, false)) {
      props.className += ' active';
    }

    return props as unknown as HTMLAnchorElement;
  }

  private readArticles(
    this: this & Component,
    params: Partial<Articles>
  ): void {
    const { author, favorited, offset } = this.articles;

    Endpoint.readArticles({
      author, favorited, offset, ...params
    }).subscribe((next) => {
      this.articles = next;
      this.renderComponent!();
    });
  }

  private updateFollow(this: this & Component): void {
    if (this.userState?.token) {
      Endpoint.updateFollow(this.profile).subscribe((next) => {
        assign(this.profile, next);
        this.renderComponent!();
      });
    } else {
      this.router.navigate('/login').subscribe();
    }
  }

  private updateLike(this: this & Component, article: Article): void {
    if (this.userState?.token) {
      Endpoint.updateLike(article).subscribe((next) => {
        const index = this.articles.articles.indexOf(article);
        this.articles.articles.splice(index, 1, next);
        this.renderComponent!();
      });
    } else {
      this.router.navigate('/login').subscribe();
    }
  }

}
