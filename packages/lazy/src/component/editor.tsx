import { Factor } from '@sgrud/core';
import { Component, Reference, Resolve, Route, Router } from '@sgrud/shell';
import { of } from 'rxjs';
import { Article, Endpoint, Errors } from 'sgrud-realworld-core';
import { AppComponent, ErrorMessages } from 'sgrud-realworld-eager';

declare global {
  interface HTMLElementTagNameMap {
    'editor-component': EditorComponent;
  }
}

@Route({
  parent: AppComponent,
  path: 'editor/:slug?'
})
@Component('editor-component')
export class EditorComponent extends HTMLElement implements Component {

  public readonly styles: string[] = ['@import url("/realworld/style.css");'];

  @Factor(() => Router)
  private readonly router!: Router;

  @Reference('form', ['input'])
  private readonly form?: HTMLFormElement | undefined;

  @Resolve<'editor/:slug?'>(({ params }) => {
    return params.slug
      ? Endpoint.readArticle(params.slug)
      : of(undefined);
  })
  private readonly article?: Article | undefined;

  private errors?: Errors | undefined;

  public get template(): JSX.Element {
    return <>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 col-xs-12 offset-md-1">
              <ErrorMessages errors={this.errors}/>
              <form key="form">
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      name="title"
                      placeholder="Article Title"
                      required={true}
                      type="text"
                      value={this.article?.title ?? ''}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      name="description"
                      placeholder="What's this article about?"
                      required={true}
                      type="text"
                      value={this.article?.description ?? ''}/>
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      name="body"
                      placeholder="Write your article (in markdown)"
                      required={true}
                      rows={8}>
                      {this.article?.body}
                    </textarea>
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      name="tagList"
                      placeholder="Enter tags"
                      type="text"
                      value={this.article?.tagList.join(' ') ?? ''}/>
                    <div className="tag-list"></div>
                  </fieldset>
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    disabled={!this.form?.checkValidity() || undefined!}
                    onclick={() => this.updateArticle()}
                    type="button">
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>;
  }

  private updateArticle(this: this & Component): void {
    const formData = new FormData(this.form);

    if (this.errors) {
      this.errors = undefined;
      this.renderComponent!();
    }

    Endpoint.updateArticle({
      ...this.article,
      body: formData.get('body')!.toString(),
      description: formData.get('description')!.toString(),
      tagList: formData.get('tagList')!.toString().split(' '),
      title: formData.get('title')!.toString()
    }).subscribe({
      error: ({ errors }: { errors: Errors }) => {
        this.errors = errors;
        this.renderComponent!();
      },
      next: (article) => this.router.navigate(
        `/article/${article.slug}`
      ).subscribe()
    });
  }

}
