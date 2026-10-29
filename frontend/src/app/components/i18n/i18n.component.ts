import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.scss'],
})
export class I18nComponent implements OnInit {
  lang: any;
  
  constructor(public translate: TranslateService) {
    this.translate.addLangs(['gb', 'fr', 'mg']);
    this.translate.setDefaultLang('fr');
    if (this.translate.currentLang == null) {
      this.translate.currentLang = this.translate.defaultLang;
    }
  }

  ngOnInit() {}

  switchLanguage($event) {
    this.translate.use($event.detail.value);
  }
}
