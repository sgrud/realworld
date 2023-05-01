import { Bus } from '@sgrud/bus';
import { Stateful, Store } from '@sgrud/state';

@Stateful(ConfigStore.handle, {
  apiUrl: 'https://api.realworld.io/api'
})
export class ConfigStore extends Store<ConfigStore> {

  public static readonly handle: Bus.Handle = 'io.github.sgrud.state.config';

  public readonly apiUrl!: string;

}
