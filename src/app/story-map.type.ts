export interface StoryMap {
  name: string;
  moduleList: string[];
  versionList: string[];
  featureList: Issue[][][];
}

export interface Issue {
  content: string;
  type: 'STORY' | 'FEATURE' | 'TASK';
}

export interface FunctionArea {
  versionNum: string;
  feature: Area[]
}

export interface Area {
  functionCol: string;
  featureList: Issue[];
}

export interface MoveEvent {
  source: {
    row: number;
    col: number;
    index: number;
  };
  target: {
    row: number;
    col: number;
    index: number;
  }
  issue: Issue;
}

export interface Position{
  row: number;
  col: number;
}

export const NAME = 'name';
export const MODULE_LIST = 'moduleList';
export const VERSION_LIST = 'versionList';
export const FEATURE_LIST = 'featureList';

export function positionConvert(position: string): Position{
  const arr = position.split('-');
  return {row: Number(arr[0]), col: Number(arr[1])}
}
