import { assign, Factor, Http, Provider, Proxy, Target } from '@sgrud/core';
import { StateHandler, Store } from '@sgrud/state';
import { first, forkJoin, from, Observable, race, switchMap, timer } from 'rxjs';
import { ConfigStore } from '../store/config';
import { UserStore } from '../store/user';

@Target()
export class UserProxy
  extends Provider<typeof Proxy>('sgrud.core.Proxy') {

  @Factor(() => ConfigStore)
  private readonly configStore!: Store<ConfigStore>;

  @Factor(() => UserStore)
  private readonly userStore!: Store<UserStore>;

  public override handle<T>(
    request: Http.Request,
    handler: Http.Handler
  ): Observable<Http.Response<T>> {
    return race(StateHandler, timer(0)).pipe(switchMap((stateHandler) => {
      if (stateHandler instanceof StateHandler) {
        return forkJoin({
          configState: from(this.configStore).pipe(first()),
          userState: from(this.userStore).pipe(first())
        }).pipe(switchMap(({ configState, userState }) => {
          if (request.url.startsWith(configState.apiUrl) && userState.token) {
            assign(request, {
              headers: {
                authorization: `Token ${userState.token}`
              }
            });
          }

          return handler.handle(request);
        }));
      }

      return handler.handle(request);
    }));
  }

}
