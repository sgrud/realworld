import { assign, Factor, HttpHandler, HttpProxy, Provider, Target } from '@sgrud/core';
import { from, Observable } from 'rxjs';
import { AjaxConfig as Request, AjaxResponse as Response } from 'rxjs/ajax';
import { Credentials } from '../api/credentials';
import { Endpoint } from '../api/endpoint';

@Target<typeof AuthProxy>()
export class AuthProxy
  extends Provider<typeof HttpProxy>('sgrud.core.http.HttpProxy') {

  @Factor(() => Credentials)
  private credentials!: Credentials;

  @Factor(() => Endpoint)
  private endpoint!: Endpoint;

  private token?: string;

  public constructor() {
    super();

    from(this.credentials).subscribe((next) => {
      this.token = next.token;
    });
  }

  public override proxy<T>(
    request: Request,
    handler: HttpHandler
  ): Observable<Response<T>> {
    if (request.url.startsWith(this.endpoint.url) && this.token) {
      return handler.handle(assign(request, {
        headers: { ...request.headers, authorization: 'Token ' + this.token }
      }));
    }

    return handler.handle(request);
  }

}
