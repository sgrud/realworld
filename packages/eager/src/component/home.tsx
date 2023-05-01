import { Factor } from '@sgrud/core';
import { Component, Fluctuate, Resolve, Route, Router } from '@sgrud/shell';
import { Store } from '@sgrud/state';
import { Article, Articles, Endpoint, UserStore } from 'sgrud-realworld-core';
import { ArticleList } from '../fragment/article/list';

declare global {
  interface HTMLElementTagNameMap {
    'home-component': HomeComponent;
  }
}

@Route({
  path: ''
})
@Component('home-component')
export class HomeComponent extends HTMLElement implements Component {

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => Router)
  private readonly router!: Router;

  @Fluctuate(() => new UserStore())
  private readonly userState?: Store.State<UserStore> | undefined;

  @Resolve(() => Endpoint.readArticles())
  private articles!: Articles;

  @Resolve(() => Endpoint.readTags())
  private readonly tagList!: string[];

  public get template(): JSX.Element {
    return <>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your <i>SGRUD</i> knowledge.</p>
          </div>
        </div>
        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {this.userState?.token && <>
                    <li className="nav-item">
                      <a {...this.navLink({
                        path: 'feed',
                        tag: undefined
                      })}>Your Feed</a>
                    </li>
                  </>}
                  <li className="nav-item">
                    <a {...this.navLink({
                      path: undefined,
                      tag: undefined
                    })}>Global Feed</a>
                  </li>
                  {this.articles.tag && <>
                    <li className="nav-item">
                      <a {...this.navLink({
                        path: undefined,
                        tag: this.articles.tag
                      })}><i className="ion-pound"></i> {this.articles.tag}</a>
                    </li>
                  </>}
                </ul>
              </div>
              <ArticleList {...this.articles}
                onlike={(article) => this.updateLike(article)}
                onoffset={(offset) => this.readArticles({ offset })}>
              </ArticleList>
            </div>
            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                {this.tagList.length > 0 ? <>
                  <div className="tag-list">
                    {this.tagList.map((tag) => <>
                      <a {...this.navPill(tag)}>{tag}</a>
                    </>)}
                  </div>
                </> : <>
                  <div>No tags are here... yet.</div>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  private navLink(params: Partial<Articles>): HTMLAnchorElement {
    const props = {
      className: 'nav-link',
      href: '#',
      onclick: (event: MouseEvent) => {
        this.readArticles({ ...params, offset: 0 });
        event.preventDefault();
      }
    };

    if (Object.keys(params).every((key) => {
      // @ts-expect-error type casting nightmare
      return params[key] === this.articles?.[key];
    })) {
      props.className += ' active';
    }

    return props as HTMLAnchorElement;
  }

  private navPill(tag: string): HTMLAnchorElement {
    const props = {
      className: 'tag-pill tag-default',
      href: '#',
      onclick: (event: MouseEvent) => {
        this.readArticles({ offset: 0, path: undefined, tag });
        event.preventDefault();
      }
    };

    if (tag === this.articles.tag) {
      props.className += ' active';
    }

    return props as HTMLAnchorElement;
  }

  private readArticles(
    this: this & Component,
    params: Partial<Articles>
  ): void {
    const { offset, path, tag } = this.articles;

    Endpoint.readArticles({
      offset, path, tag, ...params
    }).subscribe((next) => {
      this.articles = next;
      this.renderComponent!();
    });
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
