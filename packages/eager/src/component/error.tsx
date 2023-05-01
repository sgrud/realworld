import { Catch, Component, Route } from '@sgrud/shell';

declare global {
  interface HTMLElementTagNameMap {
    'error-component': ErrorComponent;
  }
}

@Route({
  path: 'error'
})
@Component('error-component')
export class ErrorComponent extends HTMLElement implements Component {

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Catch()
  private readonly error?: Error | undefined;

  public get template(): JSX.Element {
    return <>
      <div className="home-page">
        <div className="banner" style={{ background: '#b85c5c' }}>
          <div className="container">
            <h1 className="logo-font">error</h1>
            <p><strong>{this.error!.name}</strong>: {this.error!.message}</p>
          </div>
        </div>
      </div>
    </>;
  }

  public connectedCallback(this: this & Component): void {
    if (this.error) {
      console.error(this.error);
      this.renderComponent!();
    }
  }

}
