import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainComponent } from './component/main/main.component';
import {AppRouterModule} from './app.router.module';
import {HttpModule} from "@angular/http";
import { DirectoryTreeComponent } from './component/directory-tree/directory-tree.component';
import { TreeModule } from 'angular-tree-component';
import {Globals} from "./Common/Config";
import { FileListComponent } from './component/file-list/file-list.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';


import { ModalComponent } from './Component/Modal/_directives';
import { ModalService } from './Component/Modal/_services';
import {EnvService} from "./Service/Env.service";
import {HttpUtil} from "./Common/Util/httpUtil";
import {DirService} from "./Service/Dir.service";
import {FileService} from "./Service/File.service";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DirectoryTreeComponent,
    FileListComponent,
    ModalComponent


  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    AppRouterModule,
    
    FormsModule,
    TreeModule.forRoot(),
    HttpModule
  ],
  providers: [
    HttpUtil,
    ModalService,
    DirService,
    EnvService,
    FileService,
    Globals
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
