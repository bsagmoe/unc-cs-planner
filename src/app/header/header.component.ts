import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service'

@Component({
    moduleId: module.id,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {

    links: string[];

    constructor(public authService: AuthService) {}

}
