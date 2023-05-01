import { Component } from '@sgrud/shell';

declare global {
  interface HTMLElementTagNameMap {
    'footer-component': FooterComponent;
  }
}

@Component('footer-component')
export class FooterComponent extends HTMLElement implements Component {

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  public get template(): JSX.Element {
    return <>
      <footer>
        <div className="container">
          <a className="logo-font" href="/" is="router-link">conduit</a>
          <span className="attribution">
            © {new Date().getFullYear()}.
            An interactive learning project from{' '}
            <a href="https://thinkster.io">Thinkster</a>.
            Code licensed under MIT.
          </span>
        </div>
      </footer>
    </>;
  }

}
