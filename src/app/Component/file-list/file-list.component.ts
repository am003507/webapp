import {Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
import {Http, RequestOptions, ResponseContentType} from "@angular/http";
import {Globals} from "../../Common/Config";
import {DirService} from "../../Service/Dir.service";
import {statusCode} from "../../Common/status";
import {ModalService} from "../Modal/_services";

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})

export class FileListComponent implements OnInit, OnChanges {


  uppderDirName: string = "...";

  doubleClickFlag: boolean;




  /*
  select file property
   */
  selectName: string;
  selectPath: string;
  selectType: string;
  selectSize: string;
  selectLastModifiedTime: string;


  url: string;
  bodyText: string;
  copyName: string;
  copyPath: string;
  copyFilePath: string;
  selectFilePath: string;


  @Input() pathToken: string;
  @Input() curPath: string;
  @Input() rootDir: string;


  @ViewChild("EL_pathInput")
  private EL_pathInput: ElementRef;

  @ViewChild("EL_selectCard")
  private EL_selectCard: ElementRef;
  @ViewChild("EL_pasteCard")
  private EL_pasteCard: ElementRef;
  @ViewChild("EL_httpErrorInput")
  private EL_httpErrorInput: ElementRef;

  @ViewChild("EL_MoveFileTargetDir")
  private EL_MoveFileTargetDir: ElementRef;
  @ViewChild("EL_MoveFileTargetFile")
  private EL_MoveFileTargetFile: ElementRef;

  @ViewChild("El_RenameInput")
  private El_RenameInput: ElementRef;

  @ViewChild("EL_alert")
  private EL_alert: ElementRef;

  @ViewChild("EL_fileInput")
  private EL_fileInput: ElementRef;

  @ViewChild("EL_showResult")
  private EL_showResult: ElementRef;

  @ViewChild("EL_apiAlert")
    private EL_apiAlert:ElementRef;



  apiAlertClass :string;
  apiAlertMsg:string

  loadingIndicator: boolean
  isselect: boolean;

  rows = [];

  selected: any[] = [];
  sortState: boolean;

  constructor(private http: Http, private config: Globals, private dirService: DirService) {
    this.curPath = 'empty path';
    this.url = config.apiUrl;
    this.loadingIndicator = false;
    this.copyPath = null;
    this.copyName = null;
    this.sortState = false;
    this.copyFilePath = null
    this.doubleClickFlag = false;


  }
  eventHandler($event){
    if($event.key =='Enter'){

      console.log(this.EL_pathInput.nativeElement.value)
      this.LoadDirList(this.EL_pathInput.nativeElement.value);



    }
    
  }


  initSelectState() {
    console.log("initSelectState");
    this.isselect = false;
    this.selectName = null;
    this.selectPath = null;
    this.selectType = null;
    this.selectSize = null;
    this.selectLastModifiedTime = null;
    this.EL_selectCard.nativeElement.style.visibility = "hidden";
  }

  sortTable(type: string) {
    this.sortState = !this.sortState;
    this.LoadDirList( this.EL_pathInput.nativeElement.value,type);
  }

  LoadDirList(path :string,type: string = "name") {

    //변경감지 막음
    if (this.curPath == null || this.curPath == undefined) return;

    this.dirService.getDirList(path, this.sortState, type).subscribe(data => {
      this.rows = [];
      var status = data["status"];
      var msg = status["msg"];
      var response = data["response"];
      if (status["code"] == statusCode.SUCCESS) {
        let files = response["fileList"];
        console.log(files);
        for (let index in files) {
          let idx = files[index]["index"];
          let name = files[index]["name"];
          let path = files[index]["path"];
          let lastModifiedTime = files[index]["lastModifiedTime"];
          let type = files[index]["type"];
          if (type == undefined) type = "";
          let size = parseInt(files[index]["size"][0]);
          let sizeType = files[index]["size"][1];
          let data = {};
          data["idx"] = idx;
          data["name"] = name;
          data["path"] = path;
          data["lastModifiedTime"] = lastModifiedTime;
          if(data["type"]=='DIR'){
            data["size"] = "-";
          }else{
            data["size"] = size;
            data["sizeType"] = sizeType;
          }
          data["type"] = type;



          this.rows.splice(idx, 0, data);
          // this.rows.push(data);
        }
        this.curPath = path;
        this.EL_pathInput.nativeElement.value = this.curPath;
        this.MakeUppderFolder()
      } else {

        this.showAlert(status,msg);

        console.error(status);
        console.error(msg);
      }
    })
  }

  showAlert(status:string, msg : string){

    console.log("맙소사  ",msg)
    console.log("맙소사  ",status)

    this.EL_apiAlert.nativeElement.style.display ='block'
    this.apiAlertClass = 'show'
    this.apiAlertMsg =msg;
  }
  hideAlert(){
    this.EL_apiAlert.nativeElement.style.display ='none'
    this.apiAlertClass = ' '
    this.apiAlertMsg ='';
  }



  file_submit($event) {

    let query_Params: string = [
      'path=' + this.curPath
    ].join('&');
    let encode = encodeURI(query_Params);
    const formData = new FormData();
    formData.set("sourceFile", this.EL_fileInput.nativeElement.files[0]);
    this.http.post(this.url + "/api/v1/file?" + encode, formData).toPromise().then(res => {
      this.rows = [];
      let requeest_result = res.json();
      let errorMessage = requeest_result["errorMessage"];
      let response = requeest_result["response"];
      let successMessage = requeest_result["successMessage"];
      if (response != null) {
        console.log("asd");
        // this.closeModal('fileUploadModal');
        this.LoadDirList(this.curPath)
      } else {
        console.error("response null");
      }
    }).catch(this.handleErrorPromise)
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      let change = changes[propName];
      let curVal = JSON.stringify(change.currentValue);
      let prevVal = JSON.stringify(change.previousValue);
      if (propName == 'curPath') {
        console.log(curVal);
        console.log(prevVal);

        console.log("curpath 바뀜 ", this.curPath);
          this.LoadDirList(this.curPath);


      }

    }
  }



  private handleErrorPromise(error: Response | any) {
    let res = error.json();
    console.error(res["errorMessage"]);


    return Promise.reject(error.message || error);
  }


  enterDir() {
    let curInputTagPath = this.EL_pathInput.nativeElement.value;
    console.log("curInputTagPath",curInputTagPath);

    this.LoadDirList(curInputTagPath);

  }


  ngOnInit() {
    // this.bodyText = 'This text can be updated in modal 1';
    // this.EL_apiAlert.nativeElement.style.display ='none'

  }


  onSelect(index: number) {
    console.log("index ",index);

    if(index ==0) {
      return;
    }

    this.EL_selectCard.nativeElement.style.visibility = "visible";

    let selectItem = this.rows[index];
    this.isselect = true;

    this.selectName = selectItem["name"];
    this.selectLastModifiedTime = selectItem["lastModifiedTime"];
    this.selectPath = selectItem["path"];
    this.selectType = selectItem["type"];
    this.selectSize = selectItem["size"];
    this.selectFilePath = this.MakeFilePath(this.selectPath, this.selectName);

  }

  MakeFilePath(path: string, fileName: string): string {
    var ret: string;
    if (path == this.rootDir) {
      ret = path + fileName;
    } else {
      ret = path + this.pathToken + fileName;
    }
    return ret;
  }

  MakeUpperPath(path: string) {
    var split_arr = path.split(this.pathToken);
    split_arr.splice(split_arr.length - 1, 1);

    console.log(split_arr);

    if (split_arr.length <= 1) {
      return this.rootDir;
    } else {
      return split_arr.join(this.pathToken);
    }


  }


  TableDoubleClick(index: number) {
    // console.log($event);
    // console.log(this.selectName);
    var item = this.rows[index];
    var dirPath: string
    if (item["name"] == this.uppderDirName) {
      dirPath = this.MakeUpperPath(this.curPath);
    } else if (this.selectType == 'dir') {

      dirPath = this.MakeFilePath(item["path"], item["name"]);


    } else {
      console.log(this.selectPath);
      console.log(this.selectName);

      this.fileDownLoad(this.selectPath, this.selectName);


      return;
    }
    this.LoadDirList(dirPath);
  }

  fileDownLoad(path: string, name: string) {
    let param: string = [
      'name=' + name,
      'path=' + path
    ].join('&');
    let encode_param = encodeURI(param);
    const option = RequestOptions
    this.http.get(this.url + "/api/v1/file?" + encode_param).toPromise().then(res => {
      let blob = new Blob([res["_body"]]);
      const fileName: string = name;
      const objectUrl: string = URL.createObjectURL(blob);
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    })
  }
  onDetailToggle($event) {
    if (event.type == 'click') {
      console.log(event);
      console.log(this.selected);
    }
  }

  // openModal(id: string) {
  //   console.log(id);
  //   this.modalService.open(id);
  // }
  //
  // closeModal(id: string) {
  //   console.log(id);
  //   this.modalService.close(id);
  // }

  /*
  Context menu function start
   */
  copySelectPath() {

    this.EL_pasteCard.nativeElement.style.visibility = "visible";
    this.copyPath = this.selectPath;
    this.copyName = this.selectName;
    this.copyFilePath = this.MakeFilePath(this.selectPath, this.selectName);

  }

  moveSelectFile() {
    console.log("moveSelectFile");
    this.EL_MoveFileTargetFile.nativeElement.value = this.selectFilePath;

    // this.openModal('MoveFileModal');
  }

  req_MoveFile() {

    let param = {};
    console.log("ddd == ", this.selectPath);
    param["curDirPath"] = this.selectPath;
    param["fileName"] = this.selectName;
    param["newDirPath"] = this.EL_MoveFileTargetDir.nativeElement.value;


    this.http.put(this.url + "/api/v1/file", param).toPromise().then(res => {
      let request_result = res.json();
      console.log(request_result)
      let errorMessage = request_result["errorMessage"];
      let response = request_result["response"];
      let successMessage = request_result["successMessage"];
      if (response != null) {

        // this.closeModal('MoveFileModal');
        this.LoadDirList(this.curPath);
      } else {
        console.error(errorMessage);
      }
    })
  }


  clickItem(i){

  }

  contextClick($event){


    $event.stopPropagation();
    console.log("test");
    console.log($event);

  }


  test2($event){
    console.log("test2");
    console.log($event);
  }

  pasteCopyFile() {
    console.log("pasteCopyFile");

    let param = {};
    param["curDirPath"] = this.copyPath;
    param["fileName"] = this.copyName;
    param["targetDirPath"] = this.curPath;

    this.http.post(this.url + "/api/v1/file/function/copy", param).toPromise().then(res => {
      let request_result = res.json();
      console.log(request_result)
      let errorMessage = request_result["errorMessage"];
      let response = request_result["response"];
      let successMessage = request_result["successMessage"];
      if (response != null) {
        this.LoadDirList(this.curPath);


      } else {
        console.error(errorMessage);
      }
    })
  }

  execFile() {
    if (this.selectType == "dir") {
      this.openalert("디렉토리 입니다.");
    } else {
      let param = {};
      param["path"] = this.selectPath;
      param["name"] = this.selectName;
      this.http.post(this.url + "/api/v1/file/function/exec", param).toPromise().then(res => {
        let request_result = res.json();
        console.log(request_result)
        let errorMessage = request_result["errorMessage"];
        let response = request_result["response"];
        let successMessage = request_result["successMessage"];
        if (response != null) {
          console.log(response);
          this.openalert(response);
        } else {
          this.openalert(errorMessage);
        }
      })
    }


  }

  getContent() {
    if (this.selectType == "dir") {
      this.openalert("디렉토리 입니다.");
    } else {

      let param = {};
      param["path"] = this.selectPath;
      param["name"] = this.selectName;
      this.http.post(this.url + "/api/v1/file/function/content", param).toPromise().then(res => {
        let request_result = res.json();
        console.log(request_result)
        let errorMessage = request_result["errorMessage"];
        let response = request_result["response"];
        let successMessage = request_result["successMessage"];
        if (response != null) {
          console.log(response);
          this.openalert(response);
        } else {
          this.openalert(errorMessage);
        }
      })
    }
  }

  openShowResult(msg: string) {
    this.EL_showResult.nativeElement.value = msg;
    // this.openModal('showResultModal');
  }


  openalert(msg: string) {
    this.EL_alert.nativeElement.value = msg;
    // this.openModal('alert');
  }
  openRenameModal() {
    console.log("openRenameModal");
    // this.openModal('RenameModal');
  }
  DoRename() {

    let params = {};
    params["curDirPath"] = this.selectPath;
    params["fileName"] = this.selectName;
    params["newFileName"] = this.El_RenameInput.nativeElement.value;


    this.http.put(this.url + "/api/v1/file", params).toPromise().then(res => {
      let request_result = res.json();
      console.log(request_result)
      let errorMessage = request_result["errorMessage"];
      let response = request_result["response"];
      let successMessage = request_result["successMessage"];
      if (response != null) {
        // this.closeModal('RenameModal');
        this.LoadDirList(this.curPath);
      } else {
        console.error(errorMessage);
      }
    })


  }



  MakeUppderFolder() {
    if(this.curPath == this.rootDir) return;
    let data = {};
    data["idx"]="0"
    data["path"] = "-";
    data["lastModifiedTime"] = "-";
    data["type"] = "dir";
    data["size"] = "-";
    data["name"] = this.uppderDirName;
    this.rows.splice(0, 0, data);
  }






}
