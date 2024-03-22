export interface MoveInfo {
    id : number;
    type: {name: string};
    accuracy: number | null;
    power: number | null;
    pp: number;
    priority: number;
    stat_changes: any[];
    effect_entries: any[];
}