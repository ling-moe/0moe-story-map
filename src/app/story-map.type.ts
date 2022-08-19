export interface StoryMap{
  name: string;
  functionColList: string[];
  versionRowList: string[];
  featureList: Issue[][][];
}

export interface Issue{
  content: string;
  type: 'STORY' | 'FEATURE' | 'TASK';
}

export interface FunctionArea {
  versionNum: string;
  feature: Area[]
}

export interface Area{
  functionCol: string;
  featureList: Issue[];
}
