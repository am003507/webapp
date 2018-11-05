export class treeNodeModel {
  name:string =null;
  children: treeNodeModel[] = null;
  hasChildren :boolean =null;
  isExpanded : boolean = null;



  //name : 노드 이름
  //children : 하위 노드 리스트
  //hasChildren :      true ->  확장시     loading 이 보임
  // isExpanded :      false    //  이미 확장도니 상태로 보임

  constructor(name: string, children: treeNodeModel[], hasChildren: boolean = false, isExpanded: boolean =false) {
    this.name = name;
    this.children = children;
    this.hasChildren = hasChildren;
    this.isExpanded = isExpanded;
  }









}
