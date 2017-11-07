export class LoginModel {
  constructor(
    public email: string,
    public password: string,
  ) {};
}

export class RegistrationModel {
  constructor(
    public email: string,
    public password: string,
    public confirmPassword: string,
    public firstName: string = null,
    public lastName: string = null,
    public graduationYear: number = null,
    public isPrivate: boolean = false
  ) { }
}
