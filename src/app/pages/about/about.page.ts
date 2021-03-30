import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
    let script = document.createElement('script');
    script.src = "assets/about/js/webflow.js";
    script.type = 'text/javascript';
    document.body.appendChild(script)
  }

}
