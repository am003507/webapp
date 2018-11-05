import {Component, OnInit} from '@angular/core';
import {ModalService} from "./Component/Modal/_services";

// import './Modal/_content/app.less'
// import './Modal/_content/modal.less'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  bodyText: string;

  constructor(private modalService: ModalService) {
  }

  ngOnInit() {
    this.bodyText = 'This text can be updated in modal 1?';
  }

  openModal(id: string) {
    console.log(id);
    this.modalService.open(id);
  }

  closeModal(id: string) {
    console.log(id);
    this.modalService.close(id);
  }

}
