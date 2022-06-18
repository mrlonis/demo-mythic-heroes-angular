import { Component } from '@angular/core';

@Component({
  selector: 'mrlonis-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  public pageTitle = 'Welcome';
  public pageSubTitle = '';
}
