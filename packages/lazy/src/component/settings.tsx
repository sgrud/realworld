import { Factor } from '@sgrud/core';
import { Component, Fluctuate, Reference, Route, Router } from '@sgrud/shell';
import { Store } from '@sgrud/state';
import { Errors, UserStore } from 'sgrud-realworld-core';
import { AppComponent, ErrorMessages } from 'sgrud-realworld-eager';

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

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => Router)
  private readonly router!: Router;

  @Factor(() => UserStore)
  private readonly userStore!: Store<UserStore>;

  @Fluctuate(() => new UserStore())
  private readonly userState?: Store.State<UserStore> | undefined;

  @Reference('form', ['input'])
  private readonly form?: HTMLFormElement | undefined;

  private errors?: Errors | undefined;

  public get template(): JSX.Element {
    return <>
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 col-xs-12 offset-md-3">
              <h1 className="text-xs-center">Your Settings</h1>
              <ErrorMessages errors={this.errors}/>
              <form key="form">
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      name="image"
                      placeholder="URL of profile picture"
                      type="url"
                      value={this.userState?.image ?? ''}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      name="username"
                      placeholder="Your Name"
                      required={true}
                      type="text"
                      value={this.userState?.username ?? ''}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control form-control-lg"
                      name="bio"
                      placeholder="Short bio about you"
                      rows={8}>
                      {this.userState?.bio}
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
                      value={this.userState?.email ?? ''}/>
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
                    disabled={!this.form?.checkValidity() || undefined!}
                    onclick={() => this.dispatchUpdate()}
                    type="button">
                    Update Settings
                  </button>
                </fieldset>
              </form>
              <hr />
              <button
                className="btn btn-outline-danger"
                onclick={() => this.dispatchLogout()}
                type="button">
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  private dispatchLogout(this: this & Component): void {
    this.userStore.dispatch('logout').subscribe({
      error: ({ errors }: { errors: Errors }) => {
        this.errors = errors;
        this.renderComponent!();
      },
      next: () => this.router.navigate(
        '/login'
      ).subscribe()
    });
  }

  private dispatchUpdate(this: this & Component): void {
    const formData = new FormData(this.form);

    if (this.errors) {
      this.errors = undefined;
      this.renderComponent!();
    }

    this.userStore.dispatch('update', [{
      bio: formData.get('bio')!.toString(),
      email: formData.get('email')!.toString(),
      image: formData.get('image')!.toString(),
      password: formData.get('password')!.toString(),
      username: formData.get('username')!.toString()
    }]).subscribe({
      error: ({ errors }: { errors: Errors }) => {
        this.errors = errors;
        this.renderComponent!();
      },
      next: ({ username }) => this.router.navigate(
        `/profile/${username!}`
      ).subscribe()
    });
  }

}
