import { Factor, Kernel, Target } from '@sgrud/core';
import { BehaviorSubject, filter, from, observable, Subscribable, switchMap, take } from 'rxjs';
import { Api } from './typing';

@Target<typeof Credentials>()
export class Credentials {

  public readonly [Symbol.observable]: () => Subscribable<Api.User>;

  private readonly changes: BehaviorSubject<Api.User | null>;

  @Factor(() => Kernel)
  private readonly kernel!: Kernel;

  public get [observable](): () => Subscribable<Api.User> {
    return () => this.changes.asObservable().pipe(filter(Boolean));
  }

  public get user(): Api.User | null {
    return this.changes.value;
  }

  public set user(value: Api.User | null) {
    this.changes.next(value);
  }

  public constructor() {
    this.changes = new BehaviorSubject<Api.User | null>(null);
    const user = localStorage.getItem('user');

    from(this).pipe(switchMap(() => {
      return this.kernel.resolve('sgrud-realworld-lazy', '/realworld/lazy');
    }), switchMap((module) => {
      return this.kernel.insmod(module, '/realworld/lazy', true);
    }), take(1)).subscribe();

    if (user) {
      this.changes.next(JSON.parse(user));
    }

    this.changes.subscribe((next) => {
      localStorage.setItem('user', JSON.stringify(next));
    });
  }

}
