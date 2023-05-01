import { Http } from '@sgrud/core';
import { first, from, map, Observable, switchMap } from 'rxjs';
import { ConfigStore } from '../store/config';
import { Article, Articles, Comment, Profile } from './typing';

export abstract class Endpoint {

  private static get apiUrl(): Observable<string> {
    return from(new ConfigStore()).pipe(first(), map(({ apiUrl }) => apiUrl));
  }

  /*
   * Read Operations
   */

  public static readArticles({
    author = undefined,
    favorited = undefined,
    limit = 10,
    offset = 0,
    path = undefined,
    tag = undefined
  }: Partial<Articles> = {}): Observable<Articles> {
    return this.apiUrl.pipe(
      switchMap((url) => Http.request<Articles>({
        queryParams: {
          ...author && { author },
          ...favorited && { favorited },
          ...limit && { limit },
          ...offset && { offset },
          ...tag && { tag }
        },
        url: `${url}/articles` + (path ? `/${path}` : '')
      })),
      map(({ response }) => ({
        ...response, author, favorited, limit, offset, path, tag
      }))
    );
  }

  public static readArticle(slug: string): Observable<Article> {
    return this.apiUrl.pipe(
      map((url) => `${url}/articles/${slug}`),
      switchMap((url) => Http.get<{ article: Article }>(url)),
      map(({ response }) => response.article)
    );
  }

  public static readComments(slug: string): Observable<Comment[]> {
    return this.apiUrl.pipe(
      map((url) => `${url}/articles/${slug}/comments`),
      switchMap((url) => Http.get<{ comments: Comment[] }>(url)),
      map(({ response }) => response.comments)
    );
  }

  public static readProfile(username: string): Observable<Profile> {
    return this.apiUrl.pipe(
      map((url) => `${url}/profiles/${username}`),
      switchMap((url) => Http.get<{ profile: Profile }>(url)),
      map(({ response }) => response.profile)
    );
  }

  public static readTags(): Observable<string[]> {
    return this.apiUrl.pipe(
      map((url) => `${url}/tags`),
      switchMap((url) => Http.get<{ tags: string[] }>(url)),
      map(({ response }) => response.tags)
    );
  }

  /*
   * Remove Operations
   */

  public static removeArticle(
    article: Article
  ): Observable<unknown> {
    return this.apiUrl.pipe(
      map((url) => `${url}/articles/${article.slug}`),
      switchMap((url) => Http.delete<unknown>(url)),
      map(({ response }) => response)
    );
  }

  public static removeComment(
    article: Article,
    comment: Comment
  ): Observable<unknown> {
    return this.apiUrl.pipe(
      map((url) => `${url}/articles/${article.slug}/comments/${comment.id}`),
      switchMap((url) => Http.delete<unknown>(url)),
      map(({ response }) => response)
    );
  }

  /*
   * Update Operations
   */

  public static updateArticle(
    article: Partial<Article>
  ): Observable<Article> {
    return this.apiUrl.pipe(
      switchMap((url) => Http.request<{ article: Article }>({
        body: { article },
        method: article.slug ? 'PUT' : 'POST',
        url: `${url}/articles` + (article.slug ? `/${article.slug}` : '')
      })),
      map(({ response }) => response.article)
    );
  }

  public static updateComment(
    article: Article,
    comment: Partial<Comment>
  ): Observable<Comment> {
    return this.apiUrl.pipe(
      switchMap((url) => Http.request<{ comment: Comment }>({
        body: { comment },
        method: 'POST',
        url: `${url}/articles/${article.slug}/comments`
      })),
      map(({ response }) => response.comment)
    );
  }

  public static updateFollow(
    profile: Profile
  ): Observable<Profile> {
    return this.apiUrl.pipe(
      switchMap((url) => Http.request<{ profile: Profile }>({
        method: profile.following ? 'DELETE' : 'POST',
        url: `${url}/profiles/${profile.username}/follow`
      })),
      map(({ response }) => response.profile)
    );
  }

  public static updateLike(
    article: Article
  ): Observable<Article> {
    return this.apiUrl.pipe(
      switchMap((url) => Http.request<{ article: Article }>({
        method: article.favorited ? 'DELETE' : 'POST',
        url: `${url}/articles/${article.slug}/favorite`
      })),
      map(({ response }) => response.article)
    );
  }

  /*
   * Instance Invalidation
   */

  private constructor() {
    throw new TypeError('Endpoint.constructor');
  }

}
