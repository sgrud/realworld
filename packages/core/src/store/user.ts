import { Bus } from '@sgrud/bus';
import { Stateful, Store } from '@sgrud/state';
import { User } from '../conduit/typing';
import { ConfigStore } from './config';

@Stateful(UserStore.handle, {
  bio: undefined,
  email: undefined,
  image: undefined,
  token: undefined,
  username: undefined
})
export class UserStore extends Store<UserStore> {

  public static readonly handle: Bus.Handle = 'io.github.sgrud.state.user';

  public readonly bio?: string | undefined;

  public readonly email?: string | undefined;

  public readonly image?: string | undefined;

  public readonly token?: string | undefined;

  public readonly username?: string | undefined;

  public async login(
    email: string,
    password: string
  ): Promise<Store.State<this>> {
    const { fetch, state } = sgrud.state.effects;
    const config = (await state<ConfigStore>('io.github.sgrud.state.config'))!;

    const response = await fetch(`${config.apiUrl}/users/login`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          email,
          password
        }
      })
    });

    if (!response.ok) {
      throw await response.json();
    }

    const { user: next } = await response.json();
    return Object.assign({}, this, next);
  }

  public async logout(): Promise<Store.State<this>> {
    const next = {
      bio: undefined,
      email: undefined,
      image: undefined,
      password: undefined,
      token: undefined,
      username: undefined
    };

    return Object.assign({}, this, next);
  }

  public async register(
    email: string,
    username: string,
    password: string
  ): Promise<Store.State<this>> {
    const { fetch, state } = sgrud.state.effects;
    const config = (await state<ConfigStore>('io.github.sgrud.state.config'))!;

    const response = await fetch(`${config.apiUrl}/users`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          email,
          username,
          password
        }
      })
    });

    if (!response.ok) {
      throw await response.json();
    }

    const { user: next } = await response.json();
    return Object.assign({}, this, next);
  }

  public async update(user: Partial<User>): Promise<Store.State<this>> {
    const { fetch, state } = sgrud.state.effects;
    const config = (await state<ConfigStore>('io.github.sgrud.state.config'))!;

    const response = await fetch(`${config.apiUrl}/user`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'authorization': `Token ${this.token!}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        user
      })
    });

    if (!response.ok) {
      throw await response.json();
    }

    const { user: next } = await response.json();
    return Object.assign({}, this, next);
  }

}
