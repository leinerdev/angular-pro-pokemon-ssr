import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pokemons/:id',
    renderMode: RenderMode.Client,
    // async getPrerenderParams(): Promise<Array<Record<string, string>>> {
    //   const pokemons = await firstValueFrom(inject(PokemonService).loadPage(1));
    //   return pokemons.map(pokemon => ({ id: pokemon.id }));
    // }
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
