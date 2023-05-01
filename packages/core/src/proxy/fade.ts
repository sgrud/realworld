import { Target, Transit } from '@sgrud/core';
import { from } from 'rxjs';

@Target([], Transit)
export class FadeProxy extends Transit {

  public constructor() {
    super();

    document.documentElement.style.transition = '250ms filter';

    from(this).subscribe(({ length }) => {
      document.documentElement.style.filter = `grayscale(${length ? 1 : 0})`;
      document.documentElement.style.pointerEvents = length ? 'none' : 'auto';
    });
  }

}
