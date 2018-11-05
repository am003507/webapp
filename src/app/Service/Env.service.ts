import { Http ,Response} from "@angular/http";
// import { Globals } from "../Common/Config";
import {HttpClient} from '@angular/common/http';

import {Globals} from "../Common/Config";
import { Injectable } from "@angular/core";
import { HttpUtil } from "../Common/Util/httpUtil";
import { HttpParamItem } from "../Model/HttpParamModel";
import 'rxjs/add/operator/map';


@Injectable()
export class EnvService{

    constructor(private config:Globals, private http:Http,private httpUtil:HttpUtil){
        
    }

    getEnv(){
        return this.http.get(this.config.apiUrl+"/api/v1/env").map((res:Response) => res.json());
    }


 

}
