import { Factor } from '@sgrud/core';
import { Component, Reference, Route, Router } from '@sgrud/shell';
import { from, takeWhile } from 'rxjs';
import { AjaxResponse as Response } from 'rxjs/ajax';
import { Api, Credentials, Endpoint } from 'sgrud-realworld-core';

declare global {
  interface HTMLElementTagNameMap {
    'login-component': LoginComponent;
  }
}

@Route({
  path: 'login'
})
@Component('login-component')
export class LoginComponent extends HTMLElement implements Component {

  public readonly styles: string[] = [
    '@import url("//demo.productionready.io/main.css");'
  ];

  @Factor(() => Credentials)
  private readonly credentials!: Credentials;

  @Factor(() => Endpoint)
  private readonly endpoint!: Endpoint;

  @Factor(() => Router)
  private readonly router!: Router;

  @Reference('form', ['input'])
  private readonly form?: HTMLFormElement;

  private readonly errors: string[] = [];

  public get template(): JSX.Element {
    return <>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 col-xs-12 offset-md-3">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <a href="/register" is="router-link">Need an account?</a>
              </p>
              {this.errors.length > 0 && <>
                <ul className="error-messages">
                  {this.errors.map((error) => <>
                    <li>{error}</li>
                  </>)}
                </ul>
              </>}
              <form key="form">
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    name="email"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    placeholder="Email"
                    required={true}
                    type="email"/>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    name="password"
                    pattern="^.{8,}$"
                    placeholder="Password"
                    required={true}
                    type="password"/>
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  disabled={!this.form?.checkValidity() || undefined}
                  onclick={() => this.login()}
                  type="button">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  public constructor() {
    super();

    from(this.credentials).pipe(
      takeWhile(() => this.isConnected)
    ).subscribe(({ username }) => {
      this.router.navigate('/profile/' + username, undefined, true).subscribe();
    });
  }

  private login(): void {
    const formData = new FormData(this.form);

    if (this.errors.length) {
      this.errors.length = 0;
      (this as Component).renderComponent!();
    }

    this.endpoint.login(
      formData.get('email')!.toString(),
      formData.get('password')!.toString()
    ).subscribe({
      error: ({ response }: Response<Api.Error>) => {
        for (const key in response.errors) {
          for (const message of response.errors[key]) {
            this.errors.push(`${key} ${message}`);
          }
        }

        (this as Component).renderComponent!();
      }
    });
  }

}
