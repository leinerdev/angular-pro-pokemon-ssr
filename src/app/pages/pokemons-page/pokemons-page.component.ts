import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';

import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonsListSkeletonComponent } from './ui/pokemons-list-skeleton/pokemons-list-skeleton.component';
import { PokemonService } from '../../pokemons/services/pokemon.service';
import { SimplePokemon } from '../../pokemons/interfaces/simple-pokemon.interface';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-pokemons-page',
  imports: [PokemonListComponent, PokemonsListSkeletonComponent],
  templateUrl: './pokemons-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit {
  public isLoading = signal(true);
  public pokemons = signal<SimplePokemon[]>([]);

  private readonly pokemonsService = inject(PokemonService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  public currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map((params) => params.get('page') ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  ngOnInit(): void {
    this.loadPokemons();
  }

  public loadPokemons(page = 0): void {
    const pageToLoad = this.currentPage()! + page;
    this.pokemonsService
      .loadPage(pageToLoad)
      .pipe(
        tap(() =>
          this.router.navigate([], { queryParams: { page: pageToLoad } })
        ),
        tap(() => this.title.setTitle(`Pókemons SSR - Page ${pageToLoad}`))
      )
      .subscribe((pokemons) => {
        this.pokemons.set(pokemons);
        this.isLoading.set(false);
      });
  }
}
