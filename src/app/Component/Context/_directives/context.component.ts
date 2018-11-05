import {Component, ElementRef, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ContextService} from '../_services';


@Component({
  selector: 'app-context',
  template:
      `
    <div class="app-context">
      <div #contextBody class="app-context-body">
        <ng-content></ng-content>
      </div>
    </div>
    <div class="app-context-background"></div>`
})

export class ContextComponent implements OnInit, OnDestroy {
  @Input() id: string;

  @ViewChild('contextBody')
  private EL_contextBody: ElementRef;
  private element: any;

  constructor(private contextService: ContextService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    let modal = this;

    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', function (e: any) {
      if (e.target.className === 'app-context') {
        modal.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.contextService.add(this);
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    this.contextService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open($event): void {
    this.element.style.display = 'block';
    this.EL_contextBody.nativeElement.style.position = 'fixed';
    this.EL_contextBody.nativeElement.style.top = $event.clientY + 'px';
    this.EL_contextBody.nativeElement.style.left = $event.clientX + 'px';
    this.EL_contextBody.nativeElement.style.backgroundColor = 'red';
    document.body.classList.add('app-context-open');
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('app-context-open');
  }
}
