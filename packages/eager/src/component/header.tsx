import { Factor } from '@sgrud/core';
import { Component, Fluctuate, Router } from '@sgrud/shell';
import { Store } from '@sgrud/state';
import { UserStore } from 'sgrud-realworld-core';

declare global {
  interface HTMLElementTagNameMap {
    'header-component': HeaderComponent;
  }
}

@Component('header-component')
export class HeaderComponent extends HTMLElement implements Component {

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => Router)
  private readonly router!: Router;

  @Fluctuate(() => new Router())
  private readonly routerState?: Router.State | undefined;

  @Fluctuate(() => new UserStore())
  private readonly userState?: Store.State<UserStore> | undefined;

  public get template(): JSX.Element {
    return <>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="/" is="router-link">conduit</a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item"><a {...this.navLink()}>Home</a></li>
            {this.userState?.token ? <>
              <li className="nav-item">
                <a {...this.navLink('editor')}>
                  <i className="ion-compose"></i> New Article
                </a>
              </li>
              <li className="nav-item">
                <a {...this.navLink('settings')}>
                  <i className="ion-gear-a"></i> Settings
                </a>
              </li>
              <li className="nav-item">
                <a {...this.navLink('profile', this.userState.username!)}>
                  <img className="user-pic" src={this.userState.image!}/>
                  {this.userState.username}
                </a>
              </li>
            </> : <>
              <li className="nav-item">
                <a {...this.navLink('login')}>Sign in</a>
              </li>
              <li className="nav-item">
                <a {...this.navLink('register')}>Sign up</a>
              </li>
            </>}
          </ul>
        </div>
      </nav>
    </>;
  }

  private navLink(...parts: string[]): HTMLAnchorElement {
    const props = {
      className: 'nav-link',
      href: `/${parts.join('/')}`,
      is: 'router-link'
    };

    if (this.routerState?.path === this.router.rebase(props.href, false)) {
      props.className += ' active';
    }

    return props as unknown as HTMLAnchorElement;
  }

}
