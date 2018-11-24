import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() private msg:string;  //用input修饰msg变量，接收父组件传过来的msg
  @Input() private name:string;

  @Output() private outer=new EventEmitter<string>();  /*用EventEmitter 和output装饰器配合使用  <string>指定类型变量*/

  constructor() { }

  ngOnInit() {

  }

  sendParent(){
    alert('zhixing');
    this.outer.emit('msg from child')
  }

}
