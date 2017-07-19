import { Component } from '@angular/core'
import { UserContextService } from '../services/user-context.service'

@Component({
    moduleId: module.id,
    selector: 'unc-cs-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {
    constructor(private userContextService: UserContextService) {}

    links: string[];

    ngOnInit(){
    }
}