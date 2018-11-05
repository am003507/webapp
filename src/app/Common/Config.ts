import {Injectable} from "@angular/core";
import {Observable,Subscription} from "rxjs/Rx";
import {Router} from "@angular/router";
@Injectable()
export class Globals{
  apiUrl:string ="http://localhost:10000";
  // apiUrl:string =" http://192.168.30.4:10000";
  constructor(private router:Router){
    console.log("Globals init");
  };


}
