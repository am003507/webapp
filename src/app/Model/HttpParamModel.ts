export class HttpParamItem {
    key :string;
    value :string;
    constructor(key:string,value:string){
        this.key = key;
        this.value = value;
    }

    getKey(){
        return this.key;
    }
    getValue(){
        return this.value;
    }
}