import { Component, OnInit, ElementRef } from '@angular/core';
import { Doc, Array } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { YArray } from 'yjs/dist/src/internals';
import {
  CdkDragDrop,
  DragRef,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Issue, StoryMap } from './story-map.type';
import { FeatureCardComponent } from './feature-card/feature-card.component';

function b64Encode(str: string) {
  return btoa(encodeURIComponent(str));
}
function b64Decode(str: string) {
  return decodeURIComponent(atob(str));
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  storyMap: StoryMap = {
    name: '故事地图',
    functionColList: ['登陆模块', '订单模块', '消息模块', '订单模块', '消息模块'],
    versionRowList: ['未定义', 'v1.0', 'v1.1'],
    featureList: [
      [
        [{ content: '于如何使用CSS让Icon图标和文本能够垂直对齐，我想大家脑海中第一浮现的属性是著作权归作者所有', type: 'STORY' },
        { content: '九转大肠', type: 'STORY' },
        { content: '焦溜丸子', type: 'STORY' },{ content: '九转大肠', type: 'STORY' },
        { content: '焦溜丸子', type: 'STORY' },]
      ],
      [[{ content: '北京烤鸭', type: 'STORY' }]],
    ],
  };

  getfeatureList(row: number, col: number): Issue[] {
    if (!this.storyMap.featureList[row]) {
      this.storyMap.featureList[row] = [];
    }
    if (!this.storyMap.featureList[row][col]) {
      this.storyMap.featureList[row][col] = [];
    }
    return this.storyMap.featureList[row][col];
  }

  getFeatureRowSpan(row: number): number{
    let rowSpan = Math.max(...(this.storyMap.featureList[row]? this.storyMap.featureList[row] : [[]]).map(col => col.length));
    rowSpan = rowSpan > 0 ? rowSpan + 1 : 2;
    return rowSpan;
  }

  addIssue(type: 'STORY' | 'FEATURE' | 'TASK', value: string, row: number, col: number): void {
    this.storyMap.featureList[row][col].push({ content: value, type});
  }

  addVersion(version: string){
    this.storyMap.versionRowList.push(version);
  }

  addFunction(version: string){
    this.storyMap.functionColList.push(version);
  }

  address!: string;
  answer!: RTCPeerConnection;
  question!: RTCPeerConnection;
  yarray!: YArray<number>;

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  todo1 = ['红烧', '鸡翅', '我', '最爱吃'];

  done1 = ['小强', '你', '死的', '好惨', '啊'];

  timePeriods = ['Bronze age', 'Iron age'];

  ngOnInit(): void {
    // const ydoc = new Doc()
    // // clients connected to the same room-name share document updates
    // // @ts-ignore
    // const provider = new WebrtcProvider('your-room-name', ydoc, { signaling: ['ws://192.168.1.4:4444'] });
    // this.yarray = ydoc.getArray('array')
    // // observe changes of the sum
    // this.yarray.observe(event => {
    //   // print updates when the data changes
    //   console.log('new sum: ' + this.yarray.toArray().reduce((a,b) => a + b))
    // })
  }

  drop(event: CdkDragDrop<Issue[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  add() {
    // add 1 to the sum
    this.yarray.push([1]); // => "new sum: 1"
  }

  createPeerConnection() {
    const question = new RTCPeerConnection();
    question.onicecandidate = (e) => {
      let message = { type: 'candidate' };
      if (e.candidate) {
        let message = {
          type: 'candidate',
          candidate: e.candidate.candidate,
          sdpMid: e.candidate.sdpMid,
          sdpMLineIndex: e.candidate.sdpMLineIndex,
        };
      }
      console.log(b64Encode(JSON.stringify(message)));
    };
    return question;
  }

  async makeCall() {
    this.createPeerConnection();
    const offer = await this.question.createOffer();
    console.log(b64Encode(JSON.stringify({ type: 'offer', sdp: offer.sdp })));
    await this.question.setLocalDescription(offer);
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    if (this.question) {
      console.error('existing peerconnection');
      return;
    }
    this.question = this.createPeerConnection();
    this.question.setRemoteDescription(offer);

    const answer = await this.question.createAnswer();
    console.log(b64Encode(JSON.stringify({ type: 'answer', sdp: answer.sdp })));
    await this.question.setLocalDescription(answer);
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.question) {
      console.error('no peerconnection');
      return;
    }
    this.question.setRemoteDescription(answer);
  }

  async handleCandidate(candidate: RTCIceCandidateInit) {
    if (!this.question) {
      console.error('no peerconnection');
      return;
    }
    if (candidate.candidate) {
      await this.question.addIceCandidate(candidate);
    }
  }

  title = 'story-map';
}

// async function hangup() {
//   if (pc) {
//     pc.close();
//     pc = null;
//   }
//   localStream.getTracks().forEach(track => track.stop());
//   localStream = null;
//   startButton.disabled = false;
//   hangupButton.disabled = true;
// };
