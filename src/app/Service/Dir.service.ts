import { Http ,Response} from "@angular/http";
import { Globals } from "../Common/Config";
import { Injectable } from "@angular/core";
import { HttpUtil } from "../Common/Util/httpUtil";
import { HttpParamItem } from "../Model/HttpParamModel";
import 'rxjs/add/operator/map';


@Injectable()
export class DirService{
    constructor(private config:Globals, private http:Http,private httpUtil:HttpUtil){

    }


    getDirList(path:string,sort:boolean,type:string){

      var param=[
        new HttpParamItem("path",path),
        new HttpParamItem("sort",sort.toString()),
        new HttpParamItem("sortType",type),
        new HttpParamItem("limit","-1")

      ];
      var encodeParam = this.httpUtil.makeQueryData(param);

        return this.http.get(this.config.apiUrl+"/api/v1/directory/list"+encodeParam).map((res:Response) => res.json());
    }
}
