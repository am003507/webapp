import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import {EnvService} from "../../Service/Env.service";
import {HttpUtil} from "../../Common/Util/httpUtil";
import {statusCode} from "../../Common/status";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',

  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  OsType: string;
  pathToken: string;
  rootDir: string;
  curPath: string;


  constructor( private envService: EnvService,private httpUtil:HttpUtil,private historySerivce:HistoryService) {
    this.OsType = null;
    this.pathToken = null;
    this.curPath = null;
  }





  ngOnInit() {
    this.LoadEnv();
  }
  LoadEnv() {
    this.envService.getEnv().subscribe(data => {
      var status = data["status"];
      
      var response = data["response"];
      if(status["code"] == statusCode.SUCCESS){
        this.OsType = response["osName"];
        if (this.OsType == 'windows') {
          this.pathToken = '\\';
          this.rootDir = 'C:\\'
        } else if (this.OsType == 'Linux') {
          this.pathToken = '/';
          this.rootDir = '/';
        }
        this.curPath = this.rootDir;
      }else{
      }
    })
  }
  
  onRecvFunc($event) {

    let path = $event["path"];
    let name = $event["name"];


    if (path == this.rootDir) {
      this.curPath = path + name;
    }else if(path==""){
      this.curPath = name;
    }
    else {
      this.curPath = path + this.pathToken + name;
    }
  }

}

    }
  }

}
