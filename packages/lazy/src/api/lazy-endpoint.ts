import { HttpClient, Target } from '@sgrud/core';
import { map, Observable } from 'rxjs';
import { Api, Endpoint, Resource } from 'sgrud-realworld-core';

@Target<typeof LazyEndpoint>()
export class LazyEndpoint extends Endpoint {

  public user(user: Partial<Exclude<Api.User, 'token'>>): Observable<Api.User> {
    return  HttpClient.put<Resource.User>(`${this.url}/user`, { user }).pipe(
      map(({ response }) => {
        this.credentials.user = response.user;
        return response.user;
      })
    );
  }

}
