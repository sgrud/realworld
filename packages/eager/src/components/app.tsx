import { Factor } from '@sgrud/core';
import { Component, Reference, Route } from '@sgrud/shell';
import { FadeTask } from 'sgrud-realworld-core';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';

declare global {
  interface HTMLElementTagNameMap {
    'app-component': AppComponent;
  }
}

@Route({
  path: '',
  children: [
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  slots: {
    header: 'header-component',
    footer: 'footer-component'
  }
})
@Component('app-component')
export class AppComponent extends HTMLElement implements Component {

  public readonly styles: string[] = [
    '@import url("//demo.productionready.io/main.css");'
  ];

  @Factor(() => FadeTask)
  private fadeTask!: FadeTask;

  @Reference('main')
  private main?: HTMLElement;

  public get template(): JSX.Element {
    return <>
      <slot
        name="header">
      </slot>
      <main key="main">
        <slot>
          Loading route...
        </slot>
      </main>
      <slot
        name="footer">
      </slot>
    </>;
  }

  public connectedCallback(): void {
    (this as Component).renderComponent!();
    this.fadeTask.element = this.main;
  }

}
