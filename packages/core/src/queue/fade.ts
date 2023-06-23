import { Provider, Target } from '@sgrud/core';
import { Queue, Router } from '@sgrud/shell';
import { delay, finalize, Observable, switchMap, timer } from 'rxjs';

@Target()
export class FadeQueue
  extends Provider<typeof Queue>('sgrud.shell.Queue') {

  public element?: HTMLElement | undefined;

  public override handle(
    _prev: Router.State,
    next: Router.State,
    queue: Router.Queue
  ): Observable<Router.State> {
    if (this.element) {
      this.element.style.transition ||= 'opacity 100ms';
      this.element.style.opacity = '0';

      return timer(100).pipe(
        switchMap(() => queue.handle(next).pipe(delay(100))),
        finalize(() => this.element!.style.opacity = '1')
      );
    }

    return queue.handle(next);
  }

}
