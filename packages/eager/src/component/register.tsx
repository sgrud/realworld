import { Factor } from '@sgrud/core';
import { Component, Reference, Route, Router } from '@sgrud/shell';
import { Store } from '@sgrud/state';
import { Errors, UserStore } from 'sgrud-realworld-core';
import { ErrorMessages } from '../fragment/error/messages';

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

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => Router)
  private readonly router!: Router;

  @Factor(() => UserStore)
  private readonly store!: Store<UserStore>;

  @Reference('form', ['input'])
  private readonly form?: HTMLFormElement | undefined;

  private errors?: Errors | undefined;

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
              <ErrorMessages errors={this.errors}/>
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
                  disabled={!this.form?.checkValidity() || undefined!}
                  onclick={() => this.dispatchRegister()}
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

  private dispatchRegister(this: this & Component): void {
    const formData = new FormData(this.form);

    if (this.errors) {
      this.errors = undefined;
      this.renderComponent!();
    }

    this.store.dispatch('register', [
      formData.get('email')!.toString(),
      formData.get('username')!.toString(),
      formData.get('password')!.toString()
    ]).subscribe({
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
