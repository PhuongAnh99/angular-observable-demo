import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap, of } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  user$!: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.user$ = this.route.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        if (id) {
          this.isEditMode = true;
          return this.userService.getUser(+id);
        }
        return of(null);
      }),
      tap((user) => {
        if (user) {
          this.userForm.patchValue(user);
        }
      })
    );
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: [''],
      }),
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: [''],
        geo: this.fb.group({
          lat: [''],
          lng: [''],
        }),
      }),
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.isEditMode) {
        this.route.params
          .pipe(
            switchMap((params) =>
              this.userService.updateUser(+params['id'], userData)
            )
          )
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      } else {
        this.userService.createUser(userData).subscribe(() => {
          this.router.navigate(['/users']);
        });
      }
    }
  }
}
