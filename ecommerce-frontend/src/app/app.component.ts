import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import * as AuthActions from './store/actions/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.store.dispatch(AuthActions.loadUser());
    }
  }
}