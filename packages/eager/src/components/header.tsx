import { Factor } from '@sgrud/core';
import { Component, Router } from '@sgrud/shell';
import { from, merge } from 'rxjs';
import { Credentials } from 'sgrud-realworld-core';

declare global {
  interface HTMLElementTagNameMap {
    'header-component': HeaderComponent;
  }
}

@Component('header-component')
export class HeaderComponent extends HTMLElement implements Component {

  public styles: string[] = [
    '@import url("//demo.productionready.io/main.css");'
  ];

  @Factor(() => Credentials)
  private credentials!: Credentials;

  @Factor(() => Router)
  private router!: Router;

  public get template(): JSX.Element {
    return <>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="/" is="router-link">conduit</a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <a is="router-link"
                {...this.navLink()}>
                Home
              </a>
            </li>
            {this.credentials.user?.token ? <>
              <li className="nav-item">
                <a is="router-link"
                  {...this.navLink('editor')}>
                  <i className="ion-compose"></i>
                  &nbsp;New Article
                </a>
              </li>
              <li className="nav-item">
                <a is="router-link"
                  {...this.navLink('settings')}>
                  <i className="ion-gear-a"></i>
                  &nbsp;Settings
                </a>
              </li>
              <li className="nav-item">
                <a is="router-link"
                  {...this.navLink('profile', this.credentials.user.username)}>
                  <img
                    alt="user image"
                    className="user-pic"
                    src={this.credentials.user.image}/>
                  {this.credentials.user.username}
                </a>
              </li>
            </> : <>
              <li className="nav-item">
                <a is="router-link"
                  {...this.navLink('login')}>
                  Sign in
                </a>
              </li>
              <li className="nav-item">
                <a is="router-link"
                  {...this.navLink('register')}>
                  Sign up
                </a>
              </li>
            </>}
          </ul>
        </div>
      </nav>
    </>;
  }

  public connectedCallback(): void {
    merge(
      from(this.credentials),
      from(this.router)
    ).subscribe(() => {
      (this as Component).renderComponent!();
    });
  }

  private navLink(...parts: string[]): { className: string; href: string } {
    const href = '/' + parts.join('/');
    const props = { className: 'nav-link', href };

    if (this.router.rebase(href, false) === this.router.state.path) {
      props.className += ' active';
    }

    return props;
  }

}
