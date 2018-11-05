import {Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter} from '@angular/core';
import {TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeComponent} from 'angular-tree-component';
import {Http, RequestOptions} from "@angular/http";
import {Globals} from "../../Common/Config";
import {default_nodes} from "../../Model/Sample/treeview_model";
import {HttpParamItem} from "../../Model/HttpParamModel";
import {DirService} from "../../Service/Dir.service";
import {statusCode} from "../../Common/status";


@Component({
  selector: 'app-directory-tree',
  templateUrl: './directory-tree.component.html',
  styleUrls: ['./directory-tree.component.css']
})

export class DirectoryTreeComponent implements OnInit, OnChanges {
  url: String;
  @Input() pathToken: string;
  @Input() rootDir: string;
  @Output() sendObject = new EventEmitter<Object>();

  nodes = null;
  options: ITreeOptions = {};
  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private http: Http, private config: Globals,private dirService:DirService) {
    this.url = config.apiUrl;
    this.pathToken = null;
    this.rootDir = null;
    //set model
    // this.nodes =default_nodes;
    this.nodes = [
      {
        name: this.rootDir,
        hasChildren: true



      }];
  }

  LoadDirList(node:object, path:string, sort:boolean =false, type="name"){
    if(path ==null ||path==undefined)return;
    this.dirService.getDirList(path,sort,type).subscribe(data=>{
      var status = data["status"];
      var msg = status["msg"];
      var response = data["response"];
      if(status["code"] == statusCode.SUCCESS){
        let files = response["fileList"];
        this.addChildNode(node, files);
      }else{
        console.error(status);
        console.error(msg);
      }
    })
  }
  //@Input 변경 감지
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    for (let propName in changes) {
      let change = changes[propName];
      let curVal = JSON.stringify(change.currentValue);
      let prevVal = JSON.stringify(change.previousValue);
      // console.log("propName",propName)
      // console.log("curVal",curVal)
      // console.log("prevVal",prevVal)
      // console.log("rootDir",this.rootDir)
      if (propName == 'rootDir') {
        if (curVal != undefined) {
          // console.log("rootDir ??? ",this.rootDir)
          this.nodes = [
            {
              name: this.rootDir,
              hasChildren: true,
              path:""
            }];

          this.LoadDirList(this.nodes[0],this.rootDir);

          // this.getRootDirList();
        }
      }
    }
  }
  ngOnInit() {
  }

  addChildNode(node: object, files: object) {
    console.log("addChildNode",node);
    node["children"]=[];
    for (let index in files) {
      let file = files[index];
      let hasChildren: boolean = false;
      if (file["type"] == "DIR") {
        hasChildren = true;
        node["children"].push(this.MakeNode(file["name"], file["path"], hasChildren, false));
      }
    }
    this.updateTree();
  }
  updateTree() {
    this.tree.treeModel.update();
  }

  tree_context_test($event){
    console.log("")
  }

  //tree
  tree_toggleExpanded($event) {
    console.log("toggleExpanded");
    // console.log($event);
    // console.log($event.node);
    // console.log($event.node.data);
    let node = $event.node.data;
    let path  = this.MakeDirPath(node.path,node.name);
    // console.log(node.path);
    this.LoadDirList(node,path);
    // this.getDirList(node, path);
  }

  MakeDirPath(curPath:string,name:string):string{
    if(curPath ==this.rootDir){
      return curPath+name;
    }else{
     return curPath+this.pathToken+name;;
    }
  }

  tree_activate($event) {
    // console.log("tree_activate");
    // console.log($event);
  }

  tree_focus($event) {
    // console.log("tree_focus");
    // console.log($event);
    // console.log($event.node.data);
    let node = $event.node.data;
    console.log("node",node);
    let senddata={};
    senddata["path"]=node["path"];
    senddata["name"]=node["name"];



    if(node["hasChildren"]==true){
      this.sendObject.emit(senddata);
    }






  }

  tree_blr($event) {
    // console.log("tree_blr");
    // console.log($event);
  }

  addNode() {
    // var target = this.nodes
    // let dd = JSON.stringify(this.nodes);
    console.log("addNode == " + this.nodes);
    console.log("addNode == " + JSON.stringify(this.nodes));
    for (let index in this.nodes) {
      console.log(index);
      console.log(this.nodes[index]);
    }
    this.nodes[0]["children"].push({name: 'asdsad'})
    console.log("name == " + this.nodes[0]["name"]);
    // this.nodes.push({ name: 'another node' });
    this.tree.treeModel.update();
  }

  MakeNode(name: string = null,
           path: string = null,
           hasChildren: boolean = false,
           isExpanded: boolean = false
  ): object {


    let node = {}
    node["name"] = name;
    node["path"] = path;
    node["hasChildren"] = hasChildren;
    node["isExpanded"] = isExpanded;
    console.log("return object   == ",node);


    return node;


  }

  checkNodes() {
    console.log(this.nodes);

  }

  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }


}
