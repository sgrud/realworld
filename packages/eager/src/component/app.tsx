import { BusHandler } from '@sgrud/bus';
import { Factor, Kernel } from '@sgrud/core';
import { Component, Reference, Route, Router } from '@sgrud/shell';
import { StateHandler, Store } from '@sgrud/state';
import { filter, first, from, map, skipWhile, switchMap } from 'rxjs';
import { FadeQueue, UserStore } from 'sgrud-realworld-core';
import { ArticleComponent } from './article';
import { ErrorComponent } from './error';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { ProfileComponent } from './profile';
import { RegisterComponent } from './register';

declare global {
  interface HTMLElementTagNameMap {
    'app-component': AppComponent;
  }
}

@Route({
  path: '',
  children: [
    ArticleComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent
  ],
  slots: {
    header: HeaderComponent,
    footer: FooterComponent
  }
})
@Component('app-component')
export class AppComponent extends HTMLElement implements Component {

  static {
    new BusHandler('/realworld/worker');
    new StateHandler('/realworld/.');
  }

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => FadeQueue)
  private readonly fadeQueue!: FadeQueue;

  @Factor(() => Router)
  private readonly router!: Router;

  @Factor(() => UserStore)
  private readonly userStore!: Store<UserStore>;

  @Reference('main')
  private readonly main?: HTMLElement | undefined;

  public get template(): JSX.Element {
    return <>
      <slot name="header"/>
      <main key="main"><slot/></main>
      <slot name="footer"/>
    </>;
  }

  public constructor() {
    super();

    from(this.userStore).pipe(
      first(({ username }) => !!username),
      switchMap(() => new Kernel().require('/realworld/lazy'))
    ).subscribe();

    from(this.userStore).pipe(
      filter(() => !document.hasFocus()),
      skipWhile(({ username }) => !username),
      map(({ username }) => username ? `/profile/${username}` : '/login'),
      switchMap((path) => this.router.navigate(path, undefined, 'replace'))
    ).subscribe();
  }

  public connectedCallback(this: this & Component): void {
    from(StateHandler).subscribe(() => {
      this.renderComponent!();
      this.fadeQueue.element = this.main!;
    });
  }

}
