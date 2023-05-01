/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

export interface Article {
  readonly author: Profile;
  readonly body: string;
  readonly createdAt: string;
  readonly description: string;
  readonly favorited: boolean;
  readonly favoritesCount: number;
  readonly slug: string;
  readonly tagList: string[];
  readonly title: string;
  readonly updatedAt: string;
}

export interface Articles {
  readonly author?: string | undefined;
  readonly favorited?: string | undefined;
  readonly articles: Article[];
  readonly articlesCount: number;
  readonly limit: number;
  readonly offset: number;
  readonly path?: string | undefined;
  readonly tag?: string | undefined;
}

export interface Comment {
  readonly author: Profile;
  readonly body: string;
  readonly createdAt: string;
  readonly id: number;
}

export interface Errors {
  readonly [key: string]: string[];
}

export interface Profile {
  readonly bio: string;
  readonly following: boolean;
  readonly image: string;
  readonly username: string;
}

export interface User {
  readonly bio: string;
  readonly email: string;
  readonly image: string;
  readonly password?: string | undefined;
  readonly token: string;
  readonly username: string;
}
