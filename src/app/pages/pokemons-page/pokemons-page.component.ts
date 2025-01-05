import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PokemonListComponent } from '../../pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonsListSkeletonComponent } from './ui/pokemons-list-skeleton/pokemons-list-skeleton.component';
import { PokemonService } from '../../pokemons/services/pokemon.service';
import { SimplePokemon } from '../../pokemons/interfaces/simple-pokemon.interface';

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

  ngOnInit(): void {
    this.loadPokemons();
  }

  public loadPokemons(page = 0): void {
    this.pokemonsService.loadPage(page).subscribe((pokemons) => {
      this.pokemons.set(pokemons);
      this.isLoading.set(false);
    });
  }
}
