import { HttpParamItem } from "../../Model/HttpParamModel";
import { Injectable } from "@angular/core";


@Injectable()

export class HttpUtil {


  makeQueryData(queryData: HttpParamItem[] ) {
    var paramStr:string[]=[];
    for (var i =0 ; i < queryData.length;i++){
      paramStr[i] = queryData[i].getKey()+"="+queryData[i].getValue();
    }
    var encodeParam = encodeURI(paramStr.join('&'));
    return "?"+encodeParam;
  }
  makeFormData(formData: HttpParamItem[] ) {
    
    let params = {};
  
    for (var i =0 ; i < formData.length;i++){
      params[formData[i].getKey()] = formData[i].getValue();
    }

    return params;
  }

}