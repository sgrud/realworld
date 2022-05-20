import { Factor, HttpClient, Target } from '@sgrud/core';
import { map, Observable } from 'rxjs';
import { Credentials } from './credentials';
import { Api, Resource } from './typing';

@Target<typeof Endpoint>()
export class Endpoint {

  public readonly url: string = '//api.realworld.io/api';

  @Factor(() => Credentials)
  protected credentials!: Credentials;

  public getArticle(slug: string): Observable<Api.Article> {
    return HttpClient.get<Resource.Article>(`${this.url}/${slug}`).pipe(
      map(({ response }) => response.article)
    );
  }

  public getArticlePage(
    limit: number,
    offset: number
  ): Observable<Resource.Articles> {
    return this.getPage('articles', limit, offset);
  }

  public getFeedPage(
    limit: number,
    offset: number
  ): Observable<Resource.Articles> {
    return this.getPage('feed', limit, offset);
  }

  public getPage(
    from: string,
    limit: number,
    offset: number
  ): Observable<Resource.Articles> {
    return new HttpClient().handle<Resource.Articles>({
      queryParams: { limit, offset },
      url: `${this.url}/${from}`
    }).pipe(
      map(({ response }) => response)
    );
  }

  public getTags(): Observable<string[]> {
    return HttpClient.get<Resource.Tags>(`${this.url}/tags`).pipe(
      map(({ response }) => response.tags)
    );
  }

  public login(
    email: string,
    password: string
  ): Observable<Api.User> {
    return HttpClient.post<Resource.User>(`${this.url}/users/login`, {
      user: { email, password }
    }).pipe(map(({ response }) => {
      this.credentials.user = response.user;
      return response.user;
    }));
  }

  public register(
    email: string,
    username: string,
    password: string
  ): Observable<Api.User> {
    return HttpClient.post<Resource.User>(`${this.url}/users`, {
      user: { email, username, password }
    }).pipe(map(({ response }) => {
      this.credentials.user = response.user;
      return response.user;
    }));
  }

}
