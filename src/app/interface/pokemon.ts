import { Type } from "./type"
import { Ability } from "./ability"
import { Sprites } from "./sprites"
import { Moves } from "./moves"
import { Stats } from "./stats"

export interface Pokemon {
    abilities: Ability[]
    height: number
    held_items: any[]
    id: number
    is_default: boolean
    location_area_encounters: string
    name: string
    order: number
    past_abilities: any[]
    past_types: any[]
    types: Type[]
    weight: number
    sprites: Sprites[]
    moves: Moves[]
    stats: Stats[] // 0: hp, 1: atk, 2: def, 3: sp.atk, 4: sp,def, 5: speed
}
