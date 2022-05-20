import { Provider, Target } from '@sgrud/core';
import { Router, RouterTask } from '@sgrud/shell';
import { delay, finalize, Observable, switchMap, timer } from 'rxjs';

@Target<typeof FadeTask>()
export class FadeTask
  extends Provider<typeof RouterTask>('sgrud.shell.router.RouterTask') {

  public element?: HTMLElement;

  public handle(
    _prev: Router.State<string>,
    next: Router.State<string>,
    handler: Router.Task
  ): Observable<Router.State<string>> {
    if (this.element) {
      this.element.style.transition ||= 'opacity 100ms';
      this.element.style.opacity = '0';

      return timer(100).pipe(
        switchMap(() => handler.handle(next).pipe(delay(50))),
        finalize(() => this.element!.style.opacity = '1')
      );
    }

    return handler.handle(next);
  }

}
