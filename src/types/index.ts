export * from './enums'
export * from './plugin'

type Range<
  L extends number,
  H extends number,
  R extends unknown[] = [],
  Acc extends number = never,
> = R['length'] extends H
  ? Acc | H
  : R['length'] extends L
    ? Range<L, H, [unknown, ...R], Acc | R['length']>
    : R['length'] extends 0
      ? Range<L, H, [unknown, ...R], Acc>
      : Range<L, H, [unknown, ...R], Acc | R['length']>

type Priority = Range<1, 99>

export interface OnGroupAtOptions {
  command?: string
  priority?: Priority
  block?: boolean
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
