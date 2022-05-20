import { Factor } from '@sgrud/core';
import { Component, Route } from '@sgrud/shell';
import { Api, Credentials, Endpoint } from 'sgrud-realworld-core';

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

  public styles: string[] = [
    '@import url("//demo.productionready.io/main.css");'
  ];

  @Factor(() => Credentials)
  private readonly credentials!: Credentials;

  @Factor(() => Endpoint)
  private readonly endpoint!: Endpoint;

  private articles?: Api.Article[];

  private from: string = 'articles';

  private page: number = 0;

  private pages: number = 1;

  private tag?: string;

  private tags?: string[];

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
                  <li className="nav-item">
                    <a {...this.tabbing('articles/feed')}>Your Feed</a>
                  </li>
                  <li className="nav-item">
                    <a {...this.tabbing('articles')}>Global Feed</a>
                  </li>
                  {this.tag && <>
                    <li className="nav-item">
                      <a {...this.tabbing(`articles?tag=${this.tag}`)}>
                        <i className="ion-pound"></i>
                        &nbsp;{this.tag}
                      </a>
                    </li>
                  </>}
                </ul>
              </div>
              {!this.articles ? <>
                <div className="article-preview">
                  Loading articles...
                </div>
              </> : this.articles.length === 0 ? <>
                <div className="article-preview">
                  No articles are here... yet.
                </div>
              </> : this.articles.map((article) => <>
                <div className="article-preview">
                  <div className="article-meta">
                    <a
                      href={`/profile/${article.author.username}`}
                      is="router-link">
                      <img src={article.author.image}/>
                    </a>
                    <div className="info">
                      <a
                        className="author"
                        href={`/profile/${article.author.username}`}
                        is="router-link">
                        {article.author.username}
                      </a>
                      <span className="date">
                        {new Date(article.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary pull-xs-right">
                      <i className="ion-heart"></i>
                      &nbsp;{article.favoritesCount}
                    </button>
                  </div>
                  <a
                    className="preview-link"
                    href={`/article/${article.slug}`}
                    is="router-link">
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    {article.tagList.map((tag) => <>
                      <li className="tag-default tag-outline tag-pill">
                        {tag}
                      </li>
                    </>)}
                  </a>
                </div>
              </>)}
            </div>
            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                {!this.tags ? <>
                  <div>
                    Loading tags...
                  </div>
                </> : this.tags.length === 0 ? <>
                  <div>
                    No tags are here... yet.
                  </div>
                </> : <>
                  <div className="tag-list">
                    {this.tags.map((tag) => <>
                      <a {...this.tagging(tag)}>
                        {tag}
                      </a>
                    </>)}
                  </div>
                </>}
              </div>
            </div>
          </div>
          {this.pages > 1 && <>
            <nav>
              <ul className="pagination">
                {new Array(this.pages).fill(null).map((_, page) => <>
                  <li className="active page-item">
                    <a {...this.paging(page)}>{page + 1}</a>
                  </li>
                </>)}
              </ul>
            </nav>
          </>}
        </div>
      </div>
    </>;
  }

  public constructor() {
    super();

    this.fetch();

    this.endpoint.getTags().subscribe((next) => {
      this.tags = next;
      (this as Component).renderComponent?.();
    });
  }

  private fetch(
    page: number = this.page,
    from: string = this.from
  ): void {
    const limit = 10;
    const offset = page * limit;

    this.from = from;
    this.page = page;

    if (this.articles) {
      this.articles = undefined;
      (this as Component).renderComponent?.();
    }

    this.endpoint.getPage(from, limit, offset).subscribe((next) => {
      this.articles = next.articles;
      this.pages = Math.ceil(next.articlesCount / limit);
      (this as Component).renderComponent?.();
    });
  }

  private paging(page: number): {
    className: string;
    href: string;
    onclick: (event: Event) => void;
  } {
    const props = {
      className: 'page-link',
      href: '#',
      onclick: (event: Event) => {
        event.preventDefault();

        if (page !== this.page) {
          this.fetch(page);
        }
      }
    };

    if (page === this.page) {
      props.className += ' active';
    }

    return props;
  }

  private tabbing(from: string): {
    className: string;
    href: string;
    onclick: (event: Event) => void;
  } {
    const props = {
      className: 'nav-link',
      href: '#',
      onclick: (event: Event) => {
        event.preventDefault();

        if (from === 'articles/feed' && !this.credentials.user) {
          console.log('TODO', 'REDIRECT', '/login');
        } else if (from !== this.from) {
          this.fetch(0, from);
        }
      }
    };

    if (from === this.from) {
      props.className += ' active';
    } else if (from === 'articles/feed' && !this.credentials.user) {
      props.className += ' disabled';
    }

    return props;
  }

  private tagging(tag: string): {
    className: string;
    href: string;
    onclick: (event: Event) => void;
  } {
    const props = {
      className: 'tag-pill tag-default',
      href: '#',
      onclick: (event: Event) => {
        event.preventDefault();

        if (tag !== this.tag) {
          this.tag = tag;
          this.fetch(0, `articles?tag=${this.tag}`);
        }
      }
    };

    if (tag === this.tag) {
      props.className += ' active';
    }

    return props;
  }

}
