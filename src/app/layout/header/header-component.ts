import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/common/services/auth.service';
import { MessageService } from 'src/app/common/services/message.service';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss']
})
export class HeaderComponent implements OnInit {

  searchFilter: FormControl = new FormControl();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchFilter.valueChanges
      .pipe(debounceTime(1000)) // delay search for 1s to avoid firing http req per keystroke
      .subscribe((search: string) => {
        this.messageService.sendMessage({
          instruction: 'search',
          data: {
            search
          }
        });
      });
  }

  logout() {
    this.authService.expireToken = true;
    this.authService.setToken('');
    this.authService.removeLocalStorageKey('token');
    this.router.navigateByUrl('/login');
  }

}
