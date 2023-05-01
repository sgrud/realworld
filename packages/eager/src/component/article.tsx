import { assign, Factor } from '@sgrud/core';
import { Component, Fluctuate, html, Reference, Resolve, Route, Router } from '@sgrud/shell';
import { Store } from '@sgrud/state';
import { marked } from 'marked';
import { Article, Comment, Endpoint, UserStore } from 'sgrud-realworld-core';
import { ArticleComment } from '../fragment/article/comment';
import { ArticleMeta } from '../fragment/article/meta';
import { ArticleTags } from '../fragment/article/tags';
import { DeleteButton } from '../fragment/button/delete';
import { EditButton } from '../fragment/button/edit';
import { FollowButton } from '../fragment/button/follow';
import { LikeButton } from '../fragment/button/like';

declare global {
  interface HTMLElementTagNameMap {
    'article-component': ArticleComponent;
  }
}

@Route({
  path: 'article/:slug'
})
@Component('article-component')
export class ArticleComponent extends HTMLElement implements Component {

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => Router)
  private readonly router!: Router;

  @Fluctuate(() => new UserStore())
  private readonly userState?: Store.State<UserStore> | undefined;

  @Reference('form', ['input'])
  private readonly form?: HTMLFormElement | undefined;

  @Resolve<'article/:slug'>(({ params }) => Endpoint.readArticle(params.slug))
  private readonly article!: Article;

  @Resolve<'article/:slug'>(({ params }) => Endpoint.readComments(params.slug))
  private readonly comments!: Comment[];

  public get template(): JSX.Element {
    return <>
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{this.article.title}</h1>
            <ArticleMeta article={this.article}>
              {this.article.author.username === this.userState?.username ? <>
                <EditButton article={this.article}/>
                {' '}
                <DeleteButton
                  article={this.article}
                  ondelete={() => this.removeArticle()}>
                </DeleteButton>
              </> : <>
                <FollowButton
                  profile={this.article.author}
                  onfollow={() => this.updateFollow()}>
                </FollowButton>
                {' '}
                <LikeButton
                  article={this.article}
                  onlike={() => this.updateLike()}>
                  {this.article.favorited && this.userState?.token
                    ? 'Unfavorite' : 'Favorite'} Article{' '}
                  <span className="counter">
                    ({this.article.favoritesCount})
                  </span>
                </LikeButton>
              </>}
            </ArticleMeta>
          </div>
        </div>
        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <div>{html(marked(this.article.body))}</div>
              <ArticleTags tagList={this.article.tagList}/>
            </div>
          </div>
          <hr/>
          <div className="article-actions">
            <ArticleMeta article={this.article}>
              {this.article.author.username === this.userState?.username ? <>
                <EditButton article={this.article}/>
                {' '}
                <DeleteButton
                  article={this.article}
                  ondelete={() => this.removeArticle()}>
                </DeleteButton>
              </> : <>
                <FollowButton
                  profile={this.article.author}
                  onfollow={() => this.updateFollow()}>
                </FollowButton>
                {' '}
                <LikeButton
                  article={this.article}
                  onlike={() => this.updateLike()}>
                  {this.article.favorited && this.userState?.token
                    ? 'Unfavorite' : 'Favorite'} Article{' '}
                  <span className="counter">
                    ({this.article.favoritesCount})
                  </span>
                </LikeButton>
              </>}
            </ArticleMeta>
          </div>
          <div className="row">
            <div className="col-md-8 col-xs-12 offset-md-2">
              {this.userState?.token ? <>
                <form className="card comment-form" key="form">
                  <div className="card-block">
                    <textarea
                      className="form-control"
                      name="body"
                      placeholder="Write a comment..."
                      required={true}
                      rows={3}>
                    </textarea>
                  </div>
                  <div className="card-footer">
                    <img
                      className="comment-author-img"
                      src={this.userState.image!}/>
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={!this.form?.checkValidity() || undefined!}
                      onclick={() => this.updateComment()}
                      type="button">
                      Post Comment
                    </button>
                  </div>
                </form>
              </> : <>
                <a href="/login" is="router-link">Sign in</a> or{' '}
                <a href="/register" is="router-link">sign up</a>{' '}
                to add comments on this article.
              </>}
              {this.comments.map((comment) => <>
                <ArticleComment comment={comment}>
                  {comment.author.username === this.userState?.username && <>
                    <span className="mod-options">
                      <i className="ion-trash-a" onclick={() => {
                        this.removeComment(comment);
                      }}>
                      </i>
                    </span>
                  </>}
                </ArticleComment>
              </>)}
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  private removeArticle(this: this & Component): void {
    Endpoint.removeArticle(this.article).subscribe(() => {
      this.router.navigate(`/profile/${this.userState!.username!}`).subscribe();
    });
  }

  private removeComment(this: this & Component, comment: Comment): void {
    Endpoint.removeComment(this.article, comment).subscribe(() => {
      this.comments.splice(this.comments.indexOf(comment), 1);
      this.renderComponent!();
    });
  }

  private updateComment(this: this & Component): void {
    const formData = new FormData(this.form);

    Endpoint.updateComment(this.article, {
      body: formData.get('body')!.toString()
    }).subscribe((next) => {
      this.comments.unshift(next);
      this.renderComponent!();
      this.form?.reset();
    });
  }

  private updateFollow(this: this & Component): void {
    if (this.userState?.token) {
      Endpoint.updateFollow(this.article.author).subscribe((next) => {
        assign(this.article.author, next);
        this.renderComponent!();
      });
    } else {
      this.router.navigate('/login').subscribe();
    }
  }

  private updateLike(this: this & Component): void {
    if (this.userState?.token) {
      Endpoint.updateLike(this.article).subscribe((next) => {
        assign(this.article, next);
        this.renderComponent!();
      });
    } else {
      this.router.navigate('/login').subscribe();
    }
  }

}
