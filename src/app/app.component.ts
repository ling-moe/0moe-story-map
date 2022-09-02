import { Component, OnInit } from '@angular/core';
import { Doc, Array, Map } from 'yjs';
import { FEATURE_LIST, MODULE_LIST, Issue, MoveEvent, NAME, StoryMap, VERSION_LIST, positionConvert } from './story-map.type';
import { nanoid } from 'nanoid';
import { Clipboard } from '@angular/cdk/clipboard';
import { WebsocketProvider } from 'y-websocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  storyMap: StoryMap = {
    name: '故事地图',
    moduleList: [],
    versionList: [],
    featureList: [],
  };

  yDoc;
  yMap;

  nickName: string;
  roomNum;
  room;

  wsProvider!: WebsocketProvider;

  constructor(private clipboard: Clipboard) {
    this.yDoc = new Doc();
    this.yMap = this.yDoc.getMap<any>("storyMap");
    this.nickName = localStorage.getItem('person') ? localStorage.getItem('person')! : 'Jerry';
    this.roomNum = nanoid();
    this.room = this.generateRoomNum();
   }

  ngOnInit(): void {
    this.wsProvider = new WebsocketProvider('wss://story-map.0moe.cn/server', this.roomNum, this.yDoc)
    this.wsProvider.on('status', (event: { status: any; }) => {
      // logs "connected" or "disconnected"
      console.log(event.status)
    })
    this.yMap.observeDeep(event => this.yToStoryMap());
  }

  yToStoryMap(){
    const source = this.yMap.toJSON() as any;
    source.moduleList = source.moduleList?.map((_: any) => _.name);
    source.versionList = source.versionList?.map((_: any) => _.name);
    const temp = source.featureList;
    source.featureList = [];
    Object.keys(temp).forEach(key => {
      const { row, col } = positionConvert(key);
      if (!source.featureList[row]) {
        source.featureList[row] = [];
      }
      source.featureList[row][col] = temp[key];
    })
    this.storyMap = source as StoryMap;
  }

  saveNickName(nickName: string){
    localStorage.setItem('person', nickName);
  }

  generateRoomNum(): string {
    if (window.location.pathname === '/') {
      history.replaceState({ page: 1 }, 'title 1', '/' + this.roomNum);
      this.initYDoc();
    } else {
      this.roomNum = window.location.pathname.substring(1, window.location.pathname.length);
    }
    return `${window.location.protocol}//${window.location.host}/${this.roomNum}`;
  }

  copy() {
    this.clipboard.copy(this.room);
  }

  getfeatureList(row: number, col: number): Issue[] {
    if (!this.storyMap.featureList[row]) {
      this.storyMap.featureList[row] = [];
    }
    if (!this.storyMap.featureList[row][col]) {
      this.storyMap.featureList[row][col] = [];
    }
    return this.storyMap.featureList[row][col];
  }

  addIssue(issue: Issue, row: number, col: number): void {
    this.getFeatrueGroup(row, col).push([issue]);
  }

  modifyIssue(wrap: { issue: Issue, index: number }, row: number, col: number): void {
    this.yMap.get(FEATURE_LIST)?.get(row + '-' + col).get(wrap.index).push([wrap.issue]);
  }

  addVersion(version: string) {
    const vObj = new Map();
    vObj.set('name', version);
    this.yMap.get(VERSION_LIST)?.push([vObj]);
  }

  addModule(func: string) {
    const fObj = new Map();
    fObj.set('name', func);
    this.yMap.get(MODULE_LIST)?.push([fObj]);
  }

  modifyName(name: string) {
    this.yMap.set(NAME, name);
  }

  modifyModule(func: string, index: number) {
    this.yMap.get(MODULE_LIST).get(index).set('name', func);
  }

  modifyVersion(func: string, index: number) {
    this.yMap.get(VERSION_LIST).get(index).set('name', func);
  }

  moveIssue(moveEvent: MoveEvent) {
    const { source, target, issue } = moveEvent;
    this.yMap.get(FEATURE_LIST)?.get(source.row + '-' + source.col).delete(source.index);
    this.getFeatrueGroup(target.row, target.col).insert(target.index, [issue]);
  }

  getFeatrueGroup(row: number, col: number): Array<unknown>{
    if (!this.yMap.get(FEATURE_LIST).has(`${row}-${col}`)) {
      this.yMap.get(FEATURE_LIST).set(`${row}-${col}`, new Array());
    }
    return this.yMap.get(FEATURE_LIST).get(`${row}-${col}`);
  }

  initYDoc() {
    const func = new Map();
    func.set('name', '示例模块');
    const functionColList = new Array();
    functionColList.push([func]);

    const version = new Map();
    version.set('name', '未定义');
    const versionRowList = new Array();
    versionRowList.push([version]);
    console.log(this.nickName);
    const feature = new Map();
    feature.set('content', '示例故事');
    feature.set('type', 'STORY');
    feature.set('person', this.nickName);
    const featureArea = new Array();

    featureArea.push([feature]);

    const position = new Map();
    position.set(0 + '-' + 0, featureArea)

    this.yMap.set(NAME, '故事地图');
    this.yMap.set(MODULE_LIST, functionColList);
    this.yMap.set(VERSION_LIST, versionRowList);
    this.yMap.set(FEATURE_LIST, position);

    this.yToStoryMap();
  }
  title = 'story-map';
}
