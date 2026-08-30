import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  standalone: true,  
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  @Output() toggleSidebar = new EventEmitter<void>();
   constructor(private router: Router) {}
   
  logout() {
    localStorage.clear();    // ✅ safer
    this.router.navigate(['/login']);
  }
}
