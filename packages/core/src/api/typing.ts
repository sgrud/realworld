export namespace Api {

  export interface Article {
    readonly author: Author;
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

  export interface Author {
    readonly bio: string;
    readonly following: boolean;
    readonly image: string;
    readonly username: string;
  }

  export interface Comment {
    readonly author: Author;
    readonly body: string;
    readonly createdAt: string;
    readonly id: number;
  }

  export interface Error {
    readonly errors: Record<string, string[]>;
  }

  export interface Filter {
    readonly author?: string;
    readonly favorited?: string;
    readonly limit?: number;
    readonly offset?: number;
    readonly tag?: string;
  }

  export interface Page {
    readonly filters: Filter;
    readonly type: string;
  }

  export interface User {
    readonly bio: string;
    readonly email: string;
    readonly image: string;
    readonly password?: string;
    readonly token: string;
    readonly username: string;
  }

}

export namespace Resource {

  export interface Article {
    article: Api.Article;
  }

  export interface Articles {
    articles: Api.Article[];
    articlesCount: number;
  }

  export interface Tags {
    tags: string[];
  }

  export interface User {
    user: Api.User;
  }

}
