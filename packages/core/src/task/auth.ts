import { Factor, Provider, Target } from '@sgrud/core';
import { Router, RouterTask } from '@sgrud/shell';
import { Observable, of } from 'rxjs';
import { Credentials } from '../api/credentials';

@Target<typeof AuthTask>()
export class AuthTask
  extends Provider<typeof RouterTask>('sgrud.shell.router.RouterTask') {

  @Factor(() => Credentials)
  private credentials!: Credentials;

  @Factor(() => Router)
  private router!: Router;

  private readonly private: RegExp = /^\/(editor|(profile|settings)$)/;

  private readonly public: RegExp = /^\/(login|register)$/;

  public handle(
    prev: Router.State<string>,
    next: Router.State<string>,
    handler: Router.Task
  ): Observable<Router.State<string>> {
    if (this.credentials.user) {
      if (this.public.exec(next.path)) {
        return of(prev);
      }
    } else {
      if (this.private.exec(next.path)) {
        return this.router.navigate('login');
      }
    }

    return handler.handle(next);
  }

}
