import { Factor } from '@sgrud/core';
import { Component, Reference, Route, Router } from '@sgrud/shell';
import { AjaxResponse as Response } from 'rxjs/ajax';
import { Api, Credentials } from 'sgrud-realworld-core';
import { AppComponent } from 'sgrud-realworld-eager';
import { LazyEndpoint } from '../api/lazy-endpoint';

declare global {
  interface HTMLElementTagNameMap {
    'settings-component': SettingsComponent;
  }
}

@Route({
  parent: AppComponent,
  path: 'settings'
})
@Component('settings-component')
export class SettingsComponent extends HTMLElement implements Component {

  public readonly styles: string[] = [
    '@import url("//demo.productionready.io/main.css");'
  ];

  @Factor(() => Credentials)
  private readonly credentials!: Credentials;

  @Factor(() => LazyEndpoint)
  private readonly endpoint!: LazyEndpoint;

  @Reference('form', ['input'])
  private readonly form?: HTMLFormElement;

  @Factor(() => Router)
  private readonly router!: Router;

  private readonly errors: string[] = [];

  public get template(): JSX.Element {
    return <>
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 col-xs-12 offset-md-3">
              <h1 className="text-xs-center">Your Settings</h1>
              {this.errors.length > 0 && <>
                <ul className="error-messages">
                  {this.errors.map((error) => <>
                    <li>{error}</li>
                  </>)}
                </ul>
              </>}
              <form key="form">
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      name="image"
                      placeholder="URL of profile picture"
                      type="url"
                      value={this.user.image}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      name="username"
                      placeholder="Your Name"
                      required={true}
                      type="text"
                      value={this.user.username}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control form-control-lg"
                      name="bio"
                      placeholder="Short bio about you"
                      rows={8}>
                      {this.user.bio}
                    </textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      name="email"
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      placeholder="Email"
                      required={true}
                      type="email"
                      value={this.user.email}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      name="password"
                      pattern="^.{8,}$"
                      placeholder="Password"
                      type="password"/>
                  </fieldset>
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    disabled={!this.form?.checkValidity() || undefined}
                    onclick={() => this.update()}
                    type="button">
                    Update Settings
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  private get user(): Api.User {
    return this.credentials.user!;
  }

  private update(): void {
    const formData = new FormData(this.form);

    if (this.errors.length) {
      this.errors.length = 0;
      (this as Component).renderComponent!();
    }

    this.endpoint.user({
      bio: formData.get('bio')!.toString(),
      email: formData.get('email')!.toString(),
      image: formData.get('image')!.toString(),
      password: formData.get('password')!.toString(),
      username: formData.get('username')!.toString()
    }).subscribe({
      error: ({ response }: Response<Api.Error>) => {
        for (const key in response.errors) {
          for (const message of response.errors[key]) {
            this.errors.push(`${key} ${message}`);
          }
        }

        (this as Component).renderComponent!();
      },
      next: ({ username }) => {
        this.router.navigate('/profile/' + username).subscribe();
      }
    });
  }

}
