import { Factor } from '@sgrud/core';
import { Component, Reference, Route, Router } from '@sgrud/shell';
import { from, takeWhile } from 'rxjs';
import { AjaxResponse as Response } from 'rxjs/ajax';
import { Api, Credentials, Endpoint } from 'sgrud-realworld-core';

declare global {
  interface HTMLElementTagNameMap {
    'register-component': RegisterComponent;
  }
}

@Route({
  path: 'register'
})
@Component('register-component')
export class RegisterComponent extends HTMLElement implements Component {

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
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <a href="/login" is="router-link">Have an account?</a>
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
                    name="username"
                    placeholder="Your Name"
                    required={true}
                    type="text"/>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    name="email"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    placeholder="Email"
                    required={true}
                    type="text"/>
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
                  onclick={() => this.register()}
                  type="button">
                  Sign up
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

  private register(): void {
    const formData = new FormData(this.form);

    if (this.errors.length) {
      this.errors.length = 0;
      (this as Component).renderComponent!();
    }

    this.endpoint.register(
      formData.get('email')!.toString(),
      formData.get('username')!.toString(),
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
