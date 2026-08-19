import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from '../sidenav/sidenav';
import { Header } from '../header/header';

@Component({
  selector: 'app-main-layout',
  imports: [Header, Sidenav, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
